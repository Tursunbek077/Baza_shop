import { supabase } from '../utils/supabaseClient';
import { INITIAL_PRODUCTS, INITIAL_BANNER } from '../data/initialData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

// Helper to parse embedded cloud metadata from product description
const parseProductDescription = (rawDescription) => {
  if (!rawDescription) return { description: '', colors: null, isSale: null, name_ru: null, description_ru: null };
  const metaMatch = rawDescription.match(/<!--BZ_META:([\s\S]*?)-->/);
  if (metaMatch && metaMatch[1]) {
    try {
      const meta = JSON.parse(metaMatch[1]);
      const cleanDesc = rawDescription.replace(metaMatch[0], '').trim();
      return {
        description: cleanDesc,
        colors: Array.isArray(meta.colors) && meta.colors.length > 0 ? meta.colors : null,
        isSale: typeof meta.isSale === 'boolean' ? meta.isSale : null,
        name_ru: meta.name_ru || meta.nameRu || null,
        description_ru: meta.description_ru || meta.descriptionRu || null,
      };
    } catch {
      // Fallback if parsing fails
    }
  }
  return { description: rawDescription, colors: null, isSale: null, name_ru: null, description_ru: null };
};

// Helper to embed cloud metadata into product description
const formatProductDescriptionWithMeta = (description, colors, isSale, name_ru, description_ru) => {
  const cleanDesc = (description || '').replace(/<!--BZ_META:[\s\S]*?-->/g, '').trim();
  const meta = {};
  if (Array.isArray(colors) && colors.length > 0) meta.colors = colors;
  if (typeof isSale === 'boolean') meta.isSale = isSale;
  if (name_ru) meta.name_ru = name_ru;
  if (description_ru) meta.description_ru = description_ru;

  if (Object.keys(meta).length === 0) return cleanDesc;
  return `${cleanDesc}\n<!--BZ_META:${JSON.stringify(meta)}-->`.trim();
};

// Map database snake_case columns to frontend camelCase
const mapProductFromDB = (row) => {
  const parsed = parseProductDescription(row.description);
  const initialMatch = INITIAL_PRODUCTS.find(p => p.id === row.id) || {};

  // 1. Check native colors column
  let colors = null;
  if (Array.isArray(row.colors) && row.colors.length > 0) {
    colors = row.colors;
  }
  // 2. Check embedded cloud metadata in description (works even if colors column doesn't exist)
  if (!colors && parsed.colors) {
    colors = parsed.colors;
  }
  // 3. Check local storage cache for this specific product
  if (!colors || colors.length === 0) {
    try {
      const cached = typeof window !== 'undefined' ? loadFromStorage(STORAGE_KEYS.PRODUCTS, []) : [];
      const match = cached.find(p => p.id === row.id);
      if (match?.colors && match.colors.length > 0) {
        colors = match.colors;
      }
    } catch {}
  }
  // 4. Fallback to initial products or defaults
  if (!colors || colors.length === 0) {
    colors = initialMatch.colors || ['Klassik Qora', 'Pudra Pushti'];
  }

  // isSale check: native row.is_sale or parsed metadata
  let isSale = false;
  if (row.is_sale !== undefined && row.is_sale !== null) {
    isSale = Boolean(row.is_sale);
  } else if (parsed.isSale !== null) {
    isSale = parsed.isSale;
  }

  const name_uz = row.name_uz || row.name || initialMatch.name_uz || initialMatch.name || '';
  const name_ru = row.name_ru || parsed.name_ru || initialMatch.name_ru || '';
  const description_uz = row.description_uz || parsed.description || initialMatch.description_uz || initialMatch.description || '';
  const description_ru = row.description_ru || parsed.description_ru || initialMatch.description_ru || '';

  return {
    id: row.id,
    name: row.name,
    name_uz,
    name_ru,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    sizes: row.sizes || ['M', 'L'],
    colors,
    image: row.image || '',
    stockStatus: row.stock_status || 'in_stock',
    isSale,
    isBannerHero: Boolean(row.is_banner_hero),
    description: parsed.description,
    description_uz,
    description_ru,
    createdAt: row.created_at,
  };
};

const mapProductToDB = (prod, includeExtra = true) => {
  const name_ru = prod.name_ru || prod.nameRu || '';
  const description_ru = prod.description_ru || prod.descriptionRu || '';

  // Always embed metadata inside description so colors, isSale, and Russian translations are NEVER lost
  const descriptionWithMeta = formatProductDescriptionWithMeta(
    prod.description || prod.description_uz,
    prod.colors,
    prod.isSale,
    name_ru,
    description_ru
  );

  const row = {
    id: prod.id,
    name: prod.name,
    category: prod.category,
    price: Number(prod.price),
    old_price: prod.oldPrice ? Number(prod.oldPrice) : null,
    sizes: prod.sizes,
    image: prod.image,
    stock_status: prod.stockStatus,
    is_banner_hero: Boolean(prod.isBannerHero),
    description: descriptionWithMeta,
  };
  if (includeExtra && prod.colors && prod.colors.length > 0) {
    row.colors = prod.colors;
  }
  if (includeExtra && prod.isSale !== undefined) {
    row.is_sale = Boolean(prod.isSale);
  }
  return row;
};

const mapBannerFromDB = (row) => ({
  heroProductId: row.hero_product_id || 'prod-1',
  tagline: row.tagline || INITIAL_BANNER.tagline,
  headline: row.headline || INITIAL_BANNER.headline,
  subheadline: row.subheadline || INITIAL_BANNER.subheadline,
  badgeText: row.badge_text || INITIAL_BANNER.badgeText,
  discountBadge: row.discount_badge || INITIAL_BANNER.discountBadge,
  buttonText: row.button_text || INITIAL_BANNER.buttonText,
  customImage: row.custom_image || '',
});

const mapBannerToDB = (banner) => ({
  id: 'main_banner',
  hero_product_id: banner.heroProductId,
  tagline: banner.tagline,
  headline: banner.headline,
  subheadline: banner.subheadline,
  badge_text: banner.badgeText,
  discount_badge: banner.discountBadge,
  button_text: banner.buttonText,
  custom_image: banner.customImage,
});

const mapOrderFromDB = (row) => {
  const localStatuses = typeof window !== 'undefined'
    ? loadFromStorage(STORAGE_KEYS.ORDER_STATUSES, {})
    : {};
  return {
    id: row.id,
    customerName: row.customer_name || 'Nomaʼlum xaridor',
    customerPhone: row.customer_phone || '',
    deliveryAddress: row.delivery_address || '',
    paymentMethod: row.payment_method || 'Kelishilgan holda',
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount) || 0,
    createdAt: row.created_at,
    status: row.status || localStatuses?.[row.id] || 'yangi',
  };
};

export const dbService = {
  // 1. Fetch products from Supabase (with fallback to storage)
  async fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetch products fallback to local:', error?.message);
        return loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      }

      const products = data.map(mapProductFromDB);
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return products;
    } catch (err) {
      console.warn('Network error, using local products:', err);
      return loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
  },

  // 2. Add product to Supabase
  async addProduct(newProduct) {
    try {
      const dbRow = mapProductToDB(newProduct, true);
      const { error } = await supabase.from('products').insert(dbRow);
      if (error) {
        if (error.message?.includes('colors') || error.code === 'PGRST204') {
          const fallbackRow = mapProductToDB(newProduct, false);
          const fallbackRes = await supabase.from('products').insert(fallbackRow);
          if (fallbackRes.error) console.error('Fallback insert product error:', fallbackRes.error);
        } else {
          console.error('Error inserting product to Supabase:', error);
        }
      }
    } catch (err) {
      console.error('Network error saving product:', err);
    }
  },

  // 3. Update product price
  async updateProductPrice(productId, newPrice) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ price: newPrice })
        .eq('id', productId);
      if (error) console.error('Error updating price in Supabase:', error);
    } catch (err) {
      console.error('Network error updating price:', err);
    }
  },

  // 4. Toggle stock status
  async toggleStockStatus(productId, currentStatus) {
    const nextStatus = currentStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_status: nextStatus })
        .eq('id', productId);
      if (error) console.error('Error toggling stock in Supabase:', error);
    } catch (err) {
      console.error('Network error toggling stock:', err);
    }
    return nextStatus;
  },

  // Toggle sale status (Aksiya)
  async toggleSaleStatus(productId, currentStatus) {
    const nextStatus = !currentStatus;
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_sale: nextStatus })
        .eq('id', productId);

      if (error && (error.code === '42703' || error.message?.includes('is_sale'))) {
        const cached = loadFromStorage(STORAGE_KEYS.PRODUCTS, []);
        const target = cached.find(p => p.id === productId);
        if (target) {
          const updatedMetaDesc = formatProductDescriptionWithMeta(target.description, target.colors, nextStatus);
          await supabase.from('products').update({ description: updatedMetaDesc }).eq('id', productId);
        }
      }
    } catch (err) {
      console.warn('Network error toggling sale:', err);
    }
    return nextStatus;
  },

  // 5. Delete product
  async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) console.error('Error deleting product in Supabase:', error);
    } catch (err) {
      console.error('Network error deleting product:', err);
    }
  },

  // 6. Fetch Banner from Supabase
  async fetchBanner() {
    try {
      const { data, error } = await supabase
        .from('banner')
        .select('*')
        .eq('id', 'main_banner')
        .single();

      if (error || !data) {
        return loadFromStorage(STORAGE_KEYS.BANNER, INITIAL_BANNER);
      }

      const banner = mapBannerFromDB(data);
      saveToStorage(STORAGE_KEYS.BANNER, banner);
      return banner;
    } catch (err) {
      return loadFromStorage(STORAGE_KEYS.BANNER, INITIAL_BANNER);
    }
  },

  // 7. Save Banner to Supabase
  async saveBanner(updatedBanner) {
    try {
      const dbRow = mapBannerToDB(updatedBanner);
      const { error } = await supabase.from('banner').upsert(dbRow);
      if (error) console.error('Error saving banner in Supabase:', error);
    } catch (err) {
      console.error('Network error saving banner:', err);
    }
  },

  // 8. Save Customer Order to Supabase
  async saveOrder(order) {
    try {
      const { data, error } = await supabase.from('orders').insert({
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        delivery_address: order.deliveryAddress,
        payment_method: order.paymentMethod,
        items: order.items,
        total_amount: order.totalAmount,
      }).select();

      if (error) {
        console.error('Error saving order to Supabase:', error);
        return null;
      } else {
        const createdRow = data?.[0];
        if (createdRow) {
          const mapped = mapOrderFromDB(createdRow);
          const cached = loadFromStorage(STORAGE_KEYS.ORDERS, []);
          saveToStorage(STORAGE_KEYS.ORDERS, [mapped, ...cached.filter(o => o.id !== mapped.id)]);
        }
        return createdRow;
      }
    } catch (err) {
      console.error('Network error saving order:', err);
      return null;
    }
  },

  // 9. Fetch Orders from Supabase (sorted by created_at DESC)
  async fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase fetch orders fallback to local:', error?.message);
        return loadFromStorage(STORAGE_KEYS.ORDERS, []);
      }

      const orders = data.map(mapOrderFromDB);
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return orders;
    } catch (err) {
      console.warn('Network error fetching orders, using local storage:', err);
      return loadFromStorage(STORAGE_KEYS.ORDERS, []);
    }
  },

  // 10. Update Order Status (yangi, yetkazilmoqda, yakunlandi, bekor_qilindi)
  async updateOrderStatus(orderId, status) {
    try {
      // 1. Persist to local override storage immediately for instant UI responsiveness
      const localStatuses = loadFromStorage(STORAGE_KEYS.ORDER_STATUSES, {});
      localStatuses[orderId] = status;
      saveToStorage(STORAGE_KEYS.ORDER_STATUSES, localStatuses);

      const cachedOrders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
      const updatedCache = cachedOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      saveToStorage(STORAGE_KEYS.ORDERS, updatedCache);

      // 2. Attempt update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        if (error.code === 'PGRST204' || error.message?.includes('status')) {
          console.info('Supabase orders.status column not yet defined in schema cache; saved to local state.');
        } else {
          console.error('Error updating order status in Supabase:', error);
        }
      }

      return { success: true, orderId, status };
    } catch (err) {
      console.error('Network error updating order status:', err);
      return { success: false, error: err.message };
    }
  },

  // 11. Delete Order (for test or unwanted orders)
  async deleteOrder(orderId) {
    try {
      // 1. Remove from local storage cache
      const cachedOrders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
      const filtered = cachedOrders.filter(order => order.id !== orderId);
      saveToStorage(STORAGE_KEYS.ORDERS, filtered);

      const localStatuses = loadFromStorage(STORAGE_KEYS.ORDER_STATUSES, {});
      if (localStatuses[orderId]) {
        delete localStatuses[orderId];
        saveToStorage(STORAGE_KEYS.ORDER_STATUSES, localStatuses);
      }

      // 2. Delete from Supabase
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order in Supabase:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Network error deleting order:', err);
      return false;
    }
  },

  // 12. Get Order Count (default: 'yangi' / unseen orders)
  async getOrderCount(statusFilter = 'yangi') {
    try {
      const orders = await this.fetchOrders();
      if (!orders || orders.length === 0) return 0;

      if (statusFilter === 'all') {
        return orders.length;
      }

      return orders.filter(order => (order.status || 'yangi') === statusFilter).length;
    } catch (err) {
      console.warn('Error calculating order count, falling back to local cache:', err);
      const cached = loadFromStorage(STORAGE_KEYS.ORDERS, []);
      if (statusFilter === 'all') return cached.length;
      return cached.filter(order => (order.status || 'yangi') === statusFilter).length;
    }
  },
};
