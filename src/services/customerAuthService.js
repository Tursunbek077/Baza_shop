import { supabase } from '../utils/supabaseClient';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { hashString } from '../utils/authSecurity';
import { dbService } from './dbService';
import { telegramService } from './telegramService';

/**
 * Normalize phone to clean comparable digits
 */
export const getCleanPhone = (phone) => {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
};

export const customerAuthService = {
  /**
   * Get active logged in customer
   */
  getCurrentCustomer() {
    return loadFromStorage(STORAGE_KEYS.ACTIVE_CUSTOMER, null);
  },

  /**
   * Get all registered customers (Local storage cache)
   */
  getCustomersList() {
    return loadFromStorage(STORAGE_KEYS.CUSTOMERS, []);
  },

  /**
   * 1. Register new customer
   * Step 1: phone & password
   * Step 2: firstName, lastName, address
   */
  async register({ phone, password, firstName, lastName, address }) {
    const cleanPhone = getCleanPhone(phone);
    if (!cleanPhone || cleanPhone.length < 9) {
      throw new Error('Telefon raqam to‘liq kiritilmadi.');
    }

    if (!password || password.length < 4) {
      throw new Error('Parol kamida 4 ta belgidan iborat bo‘lishi kerak.');
    }

    if (!firstName || firstName.trim().length < 2) {
      throw new Error('Iltimos, ismingizni kiriting.');
    }

    const customers = this.getCustomersList();
    const existing = customers.find(c => getCleanPhone(c.phone) === cleanPhone);

    if (existing) {
      throw new Error('Ushbu telefon raqam bilan avval ro‘yxatdan o‘tilgan. Iltimos, Kirish bo‘limidan foydalaning.');
    }

    const passwordHash = await hashString(password);
    const newCustomer = {
      id: `cust_${Date.now()}`,
      phone: phone.trim(),
      cleanPhone,
      passwordHash,
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      address: (address || '').trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local storage
    const updatedList = [newCustomer, ...customers];
    saveToStorage(STORAGE_KEYS.CUSTOMERS, updatedList);

    // 2. Set active session
    const safeProfile = {
      id: newCustomer.id,
      phone: newCustomer.phone,
      cleanPhone: newCustomer.cleanPhone,
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      address: newCustomer.address,
      createdAt: newCustomer.createdAt,
    };
    saveToStorage(STORAGE_KEYS.ACTIVE_CUSTOMER, safeProfile);

    // 3. Attempt Supabase cloud insert
    try {
      await supabase.from('customers').insert({
        id: newCustomer.id,
        phone: newCustomer.phone,
        password_hash: passwordHash,
        first_name: newCustomer.firstName,
        last_name: newCustomer.lastName,
        address: newCustomer.address,
      });
    } catch (err) {
      console.warn('Supabase customers cloud sync fallback to local:', err?.message);
    }

    return safeProfile;
  },

  /**
   * 2. Login existing customer
   */
  async login({ phone, password }) {
    const cleanPhone = getCleanPhone(phone);
    if (!cleanPhone) {
      throw new Error('Telefon raqamingizni kiriting.');
    }

    if (!password) {
      throw new Error('Parolingizni kiriting.');
    }

    const inputHash = await hashString(password);
    const customers = this.getCustomersList();
    const matchedCustomer = customers.find(c => getCleanPhone(c.phone) === cleanPhone);

    if (!matchedCustomer) {
      throw new Error('Bunday telefon raqamli foydalanuvchi topilmadi. Avval ro‘yxatdan o‘ting.');
    }

    if (matchedCustomer.passwordHash !== inputHash) {
      throw new Error('Parol noto‘g‘ri kiritildi.');
    }

    const safeProfile = {
      id: matchedCustomer.id,
      phone: matchedCustomer.phone,
      cleanPhone: matchedCustomer.cleanPhone,
      firstName: matchedCustomer.firstName,
      lastName: matchedCustomer.lastName,
      address: matchedCustomer.address,
      createdAt: matchedCustomer.createdAt,
    };

    saveToStorage(STORAGE_KEYS.ACTIVE_CUSTOMER, safeProfile);
    return safeProfile;
  },

  /**
   * 3. Logout
   */
  logout() {
    saveToStorage(STORAGE_KEYS.ACTIVE_CUSTOMER, null);
  },

  /**
   * 4. Update Profile
   */
  async updateProfile({ firstName, lastName, address }) {
    const current = this.getCurrentCustomer();
    if (!current) throw new Error('Foydalanuvchi tizimga kirmagan.');

    const updatedProfile = {
      ...current,
      firstName: (firstName || current.firstName).trim(),
      lastName: (lastName !== undefined ? lastName : current.lastName).trim(),
      address: (address !== undefined ? address : current.address).trim(),
    };

    // Update active
    saveToStorage(STORAGE_KEYS.ACTIVE_CUSTOMER, updatedProfile);

    // Update in list
    const customers = this.getCustomersList();
    const updatedList = customers.map(c =>
      c.id === current.id ? { ...c, ...updatedProfile } : c
    );
    saveToStorage(STORAGE_KEYS.CUSTOMERS, updatedList);

    // Update in Supabase
    try {
      await supabase
        .from('customers')
        .update({
          first_name: updatedProfile.firstName,
          last_name: updatedProfile.lastName,
          address: updatedProfile.address,
        })
        .eq('id', current.id);
    } catch (err) {
      console.warn('Supabase update customer notice:', err?.message);
    }

    return updatedProfile;
  },

  /**
   * 5. Get customer orders by phone
   */
  async getCustomerOrders(customerPhone) {
    const cleanTarget = getCleanPhone(customerPhone);
    if (!cleanTarget) return [];

    try {
      const allOrders = await dbService.fetchOrders();
      return allOrders.filter(o => getCleanPhone(o.customerPhone) === cleanTarget);
    } catch {
      const cached = loadFromStorage(STORAGE_KEYS.ORDERS, []);
      return cached.filter(o => getCleanPhone(o.customerPhone) === cleanTarget);
    }
  },

  /**
   * 6. Cancel order by customer
   */
  async cancelOrder(orderId, customerName, customerPhone, orderDetails = null) {
    // 1. Update order status to 'bekor_qilindi'
    await dbService.updateOrderStatus(orderId, 'bekor_qilindi');

    // 2. Resolve order info if not passed directly
    let targetOrder = orderDetails;
    if (!targetOrder) {
      try {
        const cached = loadFromStorage(STORAGE_KEYS.ORDERS, []);
        targetOrder = cached.find(o => String(o.id) === String(orderId)) || null;
      } catch (err) {
        // safe fallback
      }
    }

    // 3. Send instant detailed Telegram alert to store owner / all admins
    try {
      await telegramService.sendOrderCancelNotification({
        orderId,
        customerName: customerName || targetOrder?.customerName,
        customerPhone: customerPhone || targetOrder?.customerPhone,
        totalAmount: targetOrder?.totalAmount,
        items: targetOrder?.items,
      });
    } catch (tgErr) {
      console.warn('Telegram cancel alert error:', tgErr);
    }

    return true;
  },
};
