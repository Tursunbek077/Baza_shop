import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const DEFAULT_CONFIG = {
  chatId: '',
  enabled: true,
};

const escapeHtml = (text) => {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Format order into user-specified luxury boutique Telegram message template
 */
export const formatTelegramOrderMessage = (order) => {
  const rawId = order.id ? String(order.id) : (order.orderNumber ? String(order.orderNumber) : '101');
  const orderId = escapeHtml(rawId);
  const customerName = escapeHtml(order.customerName || 'Nomaʼlum xaridor');
  const customerPhone = escapeHtml(order.customerPhone || 'Telefon kiritilmagan');
  const address = escapeHtml(order.deliveryAddress || 'Manzil kiritilmagan');
  const totalAmount = Number(order.totalAmount || 0).toLocaleString('uz-UZ');

  let itemsText = '';
  if (Array.isArray(order.items) && order.items.length > 0) {
    if (order.items.length === 1) {
      const item = order.items[0];
      const name = escapeHtml(item.name || 'Libos');
      const size = escapeHtml(item.selectedSize || 'Standart');
      const color = escapeHtml(item.selectedColor || '');
      const spec = color ? `${size} • ${color}` : size;
      itemsText = `👗 <b>Libos:</b> ${name} (${spec}) × ${item.qty || 1} dona`;
    } else {
      const lines = order.items.map(item => {
        const name = escapeHtml(item.name || 'Libos');
        const size = escapeHtml(item.selectedSize || 'Standart');
        const color = escapeHtml(item.selectedColor || '');
        const spec = color ? `${size} • ${color}` : size;
        return `  • ${name} (${spec}) × ${item.qty || 1} dona`;
      });
      itemsText = `👗 <b>Liboslar:</b>\n${lines.join('\n')}`;
    }
  } else {
    itemsText = `👗 <b>Libos:</b> Ko‘rsatilmagan`;
  }

  return [
    `🔔 <b>YANGI BUYURTMA #${orderId}</b>`,
    ``,
    `👤 <b>Mijoz:</b> ${customerName} (${customerPhone})`,
    `📍 <b>Manzil:</b> ${address}`,
    itemsText,
    `💰 <b>Jami:</b> ${totalAmount} so‘m`,
  ].join('\n');
};

/**
 * Format order cancellation alert into Telegram message template
 */
export const formatTelegramCancelMessage = ({ orderId, customerName, customerPhone, totalAmount, items }) => {
  const safeId = escapeHtml(String(orderId || ''));
  const safeName = escapeHtml(customerName || 'Nomaʼlum xaridor');
  const safePhone = escapeHtml(customerPhone || 'Telefon kiritilmagan');

  let itemsText = '';
  if (Array.isArray(items) && items.length > 0) {
    const lines = items.map(item => {
      const name = escapeHtml(item.name || 'Libos');
      const size = escapeHtml(item.selectedSize || 'Standart');
      const color = escapeHtml(item.selectedColor || '');
      const spec = color ? `${size} • ${color}` : size;
      return `  • ${name} (${spec}) × ${item.qty || 1} dona`;
    });
    itemsText = `👗 <b>Bekor qilingan mahsulotlar:</b>\n${lines.join('\n')}`;
  }

  const amountText = totalAmount
    ? `💰 <b>Bekor qilingan summa:</b> ${Number(totalAmount).toLocaleString('uz-UZ')} so‘m`
    : '';

  return [
    `🛑 <b>DIQQAT: BUYURTMA BEKOR QILINDI #${safeId}</b>`,
    ``,
    `👤 <b>Mijoz:</b> ${safeName} (${safePhone})`,
    `❌ <b>Holat:</b> Mijoz shaxsiy kabineti orqali buyurtmani bekor qildi`,
    itemsText,
    amountText,
    `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`,
  ].filter(Boolean).join('\n');
};

export const telegramService = {
  /**
   * Telegram sozlamalarini olish (Chat ID va yoqilganligi)
   * DIQQAT: Bot Token hech qachon brauzerda saqlanmaydi, u faqat serverda bo'ladi!
   */
  getConfig() {
    const stored = loadFromStorage(STORAGE_KEYS.TELEGRAM_CONFIG, null);
    if (stored) {
      // Xavfsizlik maqsadida eski localStorage'dagi botToken'ni tozalaymiz
      if (stored.botToken) {
        delete stored.botToken;
        saveToStorage(STORAGE_KEYS.TELEGRAM_CONFIG, stored);
      }
      return {
        chatId: stored.chatId || DEFAULT_CONFIG.chatId,
        enabled: stored.enabled !== undefined ? stored.enabled : true,
      };
    }
    return DEFAULT_CONFIG;
  },

  /**
   * Telegram sozlamalarini saqlash (faqat Chat ID va holat)
   */
  saveConfig({ chatId, enabled = true }) {
    const cleanConfig = {
      chatId: (chatId || '').trim(),
      enabled: Boolean(enabled),
    };
    saveToStorage(STORAGE_KEYS.TELEGRAM_CONFIG, cleanConfig);
    return cleanConfig;
  },

  /**
   * Serverless backend orqali Telegramga xabar yuborish
   * Brauzer to'g'ridan-to'g'ri api.telegram.org ga EMAS, o'zimizning /api/telegram ga so'rov yuboradi.
   */
  async sendMessage(text, customChatId = null) {
    const config = this.getConfig();

    if (!config.enabled) {
      return { success: false, reason: 'disabled' };
    }

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          chatId: customChatId || config.chatId || undefined,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        const errorMsg = data.error || `HTTP ${response.status}: Xabar yuborishda xatolik`;
        console.warn('Telegram xabarnomasi yetkazilmadi:', errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      }

      return {
        success: true,
        totalSent: data.totalSent || 1,
        failedCount: data.failedCount || 0,
      };
    } catch (networkError) {
      console.error('Telegram API tarmog‘i xatosi:', networkError);
      return {
        success: false,
        error: networkError.message || 'Tarmoqqa ulanish xatosi',
      };
    }
  },

  /**
   * Yangi buyurtma xabarnomasini yuborish
   */
  async sendOrderNotification(order) {
    try {
      const message = formatTelegramOrderMessage(order);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Telegram buyurtma xabarnomasini yuborishda xatolik:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Buyurtma bekor qilingani haqida do'kon egalariga xabar berish
   */
  async sendOrderCancelNotification(cancelData) {
    try {
      const message = formatTelegramCancelMessage(cancelData);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Telegram bekor qilish xabarnomasini yuborishda xatolik:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Aloqani tekshirish uchun test xabarini yo'llash
   */
  async sendTestMessage(testChatId = null) {
    const testMessage = [
      `🔔 <b>Baza_Shop — Test Xabarnomasi</b>`,
      ``,
      `✅ Telegram Bot aloqasi muvaffaqiyatli o‘rnatildi!`,
      `🔒 <i>Xavfsizlik: Bot token serverless muhitida to‘liq himoyalangan.</i>`,
      `📦 Yangi buyurtmalar tushganda barcha ma’lumotlar shu yerga keladi.`,
      `🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}`,
    ].join('\n');

    return await this.sendMessage(testMessage, testChatId);
  },
};
