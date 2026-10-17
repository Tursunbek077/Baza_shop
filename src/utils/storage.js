const STORAGE_KEYS = {
  PRODUCTS: 'baza_shop_products_v3',
  BANNER: 'baza_shop_banner_v3',
  THEME: 'baza_shop_theme_v3',
  PASSWORD: 'baza_shop_admin_password_v3',
  ORDERS: 'baza_shop_orders_v3',
  ORDER_STATUSES: 'baza_shop_order_statuses_v3',
  TELEGRAM_CONFIG: 'baza_shop_telegram_config_v3',
  CUSTOMERS: 'baza_shop_customers_v3',
  ACTIVE_CUSTOMER: 'baza_shop_active_customer_v3',
};

export const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export { STORAGE_KEYS };
