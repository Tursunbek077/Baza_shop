import React, { useState, useEffect } from 'react';
import StoreHeader from '../components/store/StoreHeader';
import StoreHero from '../components/store/StoreHero';
import StoreFeatures from '../components/store/StoreFeatures';
import StoreProducts from '../components/store/StoreProducts';
import ProductDetailModal from '../components/store/ProductDetailModal';
import CartDrawer from '../components/store/CartDrawer';
import WishlistDrawer from '../components/store/WishlistDrawer';
import OrderSuccessModal from '../components/store/OrderSuccessModal';
import StoreFooter from '../components/store/StoreFooter';
import AdminLoginModal from '../components/admin/AdminLoginModal';
import CustomerAuthModal from '../components/store/CustomerAuthModal';
import CustomerProfileModal from '../components/store/CustomerProfileModal';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { dbService } from '../services/dbService';
import { customerAuthService } from '../services/customerAuthService';
import { telegramService } from '../services/telegramService';

const CART_KEY = 'baza_shop_cart_v3';
const WISHLIST_KEY = 'baza_shop_wishlist_v3';

export default function CustomerStore({
  products,
  banner,
  isDark,
  onToggleTheme,
  lang = 'uz',
  onToggleLang,
  onNavigateToAdmin,
  onReplayIntro,
}) {
  const [cart, setCart] = useState(() => loadFromStorage(CART_KEY, []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Customer Authentication & Portal states
  const [activeCustomer, setActiveCustomer] = useState(() => customerAuthService.getCurrentCustomer());
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customerAuthMode, setCustomerAuthMode] = useState('login');
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);

  // Wishlist state: strictly per registered customer
  const [wishlist, setWishlist] = useState(() => {
    const cust = customerAuthService.getCurrentCustomer();
    if (cust?.phone) {
      return loadFromStorage(`baza_shop_wishlist_${cust.phone}`, []);
    }
    return [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Auto-save cart to storage
  useEffect(() => {
    saveToStorage(CART_KEY, cart);
  }, [cart]);

  // Load registered customer's personal wishlist on login / clear on logout
  useEffect(() => {
    if (activeCustomer?.phone) {
      const saved = loadFromStorage(`baza_shop_wishlist_${activeCustomer.phone}`, []);
      setWishlist(saved);
    } else {
      setWishlist([]);
    }
  }, [activeCustomer?.phone]);

  // Auto-save wishlist only when customer is registered / logged in
  useEffect(() => {
    if (activeCustomer?.phone) {
      saveToStorage(`baza_shop_wishlist_${activeCustomer.phone}`, wishlist);
    }
  }, [wishlist, activeCustomer?.phone]);

  // Current hero product from admin settings
  const heroProduct = products.find(p => p.id === banner.heroProductId) || products[0];

  // Add to cart handler
  const handleAddToCart = (product, quantity = 1) => {
    const size = product.selectedSize || product.sizes?.[0] || 'M';
    const color = product.selectedColor || product.colors?.[0] || 'Klassik Qora';
    const cartItemId = `${product.id}_${size}_${color}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId || (item.id === product.id && item.selectedSize === size && item.selectedColor === color));
      if (existing) {
        return prev.map(item =>
          (item.cartItemId === cartItemId || (item.id === product.id && item.selectedSize === size && item.selectedColor === color))
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          selectedColor: color,
          cartItemId,
          qty: quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  // Quick 1-click buy handler
  const handleQuickBuy = (product, quantity = 1) => {
    handleAddToCart(product, quantity);
  };

  // Update quantity in cart
  const handleUpdateQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const id = item.cartItemId || `${item.id}_${item.selectedSize}_${item.selectedColor}`;
        const match =
          item.cartItemId === cartItemId ||
          id === cartItemId ||
          `${item.id}-${item.selectedSize}` === cartItemId ||
          `${item.id}-${item.selectedSize}-${item.selectedColor}` === cartItemId;
        return match ? { ...item, qty: newQty } : item;
      })
    );
  };

  // Remove item from cart
  const handleRemoveItem = (cartItemId) => {
    setCart(prev =>
      prev.filter(item => {
        const id = item.cartItemId || `${item.id}_${item.selectedSize}_${item.selectedColor}`;
        const match =
          item.cartItemId === cartItemId ||
          id === cartItemId ||
          `${item.id}-${item.selectedSize}` === cartItemId ||
          `${item.id}-${item.selectedSize}-${item.selectedColor}` === cartItemId;
        return !match;
      })
    );
  };

  // Toggle wishlist (STRICTLY requires customer registration / login)
  const handleToggleWishlist = (productId) => {
    if (!activeCustomer) {
      handleOpenCustomerAuth(
        'register',
        lang === 'ru'
          ? 'Чтобы добавлять наряды в избранное, пожалуйста, зарегистрируйтесь или войдите в профиль.'
          : 'Liboslarni sevimlilar ro‘yxatiga saqlash uchun iltimos, ro‘yxatdan o‘ting yoki profilingizga kiring.'
      );
      return;
    }

    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Open wishlist drawer (Requires customer registration / login)
  const handleOpenWishlist = () => {
    if (!activeCustomer) {
      handleOpenCustomerAuth(
        'login',
        lang === 'ru'
          ? 'Ваш список избранного доступен после входа в профиль.'
          : 'Sevimli liboslar ro‘yxatingiz profilingizga kirganingizdan so‘ng ochiladi.'
      );
      return;
    }
    setIsWishlistOpen(true);
  };

  // Handle successful checkout
  const handleCheckout = async (orderData) => {
    // 1. Snapshot items cleanly before clearing
    const orderItems = orderData.items && orderData.items.length > 0 ? [...orderData.items] : [...cart];
    const generatedOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const finalOrder = {
      ...orderData,
      orderNumber: generatedOrderNumber,
      items: orderItems,
    };

    // 2. Synchronously empty cart state and localStorage
    setCart([]);
    saveToStorage(CART_KEY, []);
    setIsCartOpen(false);
    setQuickViewProduct(null);

    // 3. Save to Supabase Cloud Database & attach returned DB ID
    let finalOrderReady = finalOrder;
    try {
      const saved = await dbService.saveOrder(finalOrder);
      if (saved && saved.id) {
        finalOrderReady = { ...finalOrder, id: saved.id };
      }
    } catch (dbErr) {
      console.warn('DB order save notice:', dbErr);
    }

    // 4. Trigger receipt modal with finalized DB ID (zero flickering)
    setSuccessOrder(finalOrderReady);

    // 5. Send real-time Telegram Bot Notification to Store Owner (multi-admin capable)
    telegramService.sendOrderNotification(finalOrderReady).then((res) => {
      if (res?.success) {
        console.log('Telegram order notification muvaffaqiyatli yetkazildi:', res);
      } else {
        console.warn('Telegram order notification yetkazilmadi:', res);
      }
    }).catch((err) => {
      console.error('Telegram order alert error:', err);
    });
  };

  // Filter products by search query
  const searchedProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Customer handlers
  const handleOpenCustomerAuth = (mode = 'login', prompt = '') => {
    setCustomerAuthMode(mode);
    setAuthPromptMessage(prompt);
    setIsCustomerAuthOpen(true);
  };

  const handleCustomerAuthSuccess = (customer) => {
    setActiveCustomer(customer);
    setIsCustomerAuthOpen(false);
    setAuthPromptMessage('');
  };

  const handleCustomerLogout = () => {
    customerAuthService.logout();
    setActiveCustomer(null);
    setWishlist([]);
    setIsWishlistOpen(false);
    setIsCustomerProfileOpen(false);
  };

  const handleCustomerUpdate = (updated) => {
    setActiveCustomer(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-rose-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* 1. Header */}
      <StoreHeader
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={activeCustomer ? wishlist.length : 0}
        onOpenWishlist={handleOpenWishlist}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onReplayIntro={onReplayIntro}
        activeCustomer={activeCustomer}
        onOpenCustomerAuth={handleOpenCustomerAuth}
        onOpenCustomerProfile={() => setIsCustomerProfileOpen(true)}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        lang={lang}
        onToggleLang={onToggleLang}
      />

      {/* 2. Main Storefront Sections */}
      <main className="flex-1 space-y-6 sm:space-y-12">
        {/* Dynamic Hero Banner */}
        <StoreHero
          banner={banner}
          heroProduct={heroProduct}
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
          lang={lang}
        />

        {/* Boutique Trust Features */}
        <StoreFeatures lang={lang} />
        {/* Collection Catalog Grid */}
        <StoreProducts
          products={searchedProducts}
          heroProductId={banner.heroProductId}
          onAddToCart={handleAddToCart}
          onOpenQuickView={setQuickViewProduct}
          onQuickBuy={handleQuickBuy}
          wishlist={activeCustomer ? wishlist : []}
          onToggleWishlist={handleToggleWishlist}
          lang={lang}
        />
      </main>

      {/* 3. Footer with discreet protected staff entrance */}
      <StoreFooter
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        lang={lang}
      />

      {/* 4. Modals and Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onQuickBuy={handleQuickBuy}
        isWishlisted={Boolean(activeCustomer && quickViewProduct && wishlist.includes(quickViewProduct.id))}
        onToggleWishlist={handleToggleWishlist}
        lang={lang}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        activeCustomer={activeCustomer}
        onOpenCustomerAuth={handleOpenCustomerAuth}
        lang={lang}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={activeCustomer ? wishlist : []}
        products={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setQuickViewProduct}
        lang={lang}
      />

      <OrderSuccessModal
        order={successOrder}
        isOpen={Boolean(successOrder)}
        onClose={() => setSuccessOrder(null)}
        lang={lang}
      />

      {/* 5. Customer Authentication & Profile Modals */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => {
          setIsCustomerAuthOpen(false);
          setAuthPromptMessage('');
        }}
        onSuccess={handleCustomerAuthSuccess}
        initialMode={customerAuthMode}
        promptMessage={authPromptMessage}
        lang={lang}
      />

      <CustomerProfileModal
        isOpen={isCustomerProfileOpen}
        onClose={() => setIsCustomerProfileOpen(false)}
        customer={activeCustomer}
        onLogout={handleCustomerLogout}
        onUpdateCustomer={handleCustomerUpdate}
        lang={lang}
      />

      {/* 6. Secret Password Protected Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          onNavigateToAdmin();
        }}
      />
    </div>
  );
}
