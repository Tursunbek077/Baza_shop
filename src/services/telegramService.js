import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const DEFAULT_CONFIG = {
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8920788343:AAEAxjc3ibdEA_ihjwhBNZqVeAj9qyzuDBQ',
  chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '1240646588, 1460370215, 8360418500',
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
   * Get Telegram bot configuration (Storage -> Env -> Default)
   */
  getConfig() {
    const stored = loadFromStorage(STORAGE_KEYS.TELEGRAM_CONFIG, null);
    if (stored) {
      return {
        botToken: stored.botToken || DEFAULT_CONFIG.botToken,
        chatId: stored.chatId || DEFAULT_CONFIG.chatId,
        enabled: stored.enabled !== undefined ? stored.enabled : true,
      };
    }
    return DEFAULT_CONFIG;
  },

  /**
   * Save Telegram bot configuration
   */
  saveConfig({ botToken, chatId, enabled = true }) {
    const cleanConfig = {
      botToken: (botToken || '').trim(),
      chatId: (chatId || '').trim(),
      enabled: Boolean(enabled),
    };
    saveToStorage(STORAGE_KEYS.TELEGRAM_CONFIG, cleanConfig);
    return cleanConfig;
  },

  /**
   * Parse comma/space separated chat IDs into array
   */
  getChatIdList(chatIdString) {
    if (!chatIdString) return [];
    return chatIdString
      .split(/[,;\s]+/)
      .map(id => id.trim())
      .filter(id => id.length > 0);
  },

  /**
   * Send text message to one or multiple Telegram chats
   */
  async sendMessage(text) {
    const config = this.getConfig();

    if (!config.enabled) {
      return { success: false, reason: 'disabled' };
    }

    if (!config.botToken || !config.chatId) {
      console.warn('Telegram Bot bildirishnomasi o‘rnatilmagan (Token yoki Chat ID yetishmaydi).');
      return { success: false, reason: 'not_configured' };
    }

    const chatIds = this.getChatIdList(config.chatId);
    if (chatIds.length === 0) {
      return { success: false, reason: 'no_chat_ids' };
    }

    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const results = await Promise.allSettled(
      chatIds.map(async (targetChatId) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetChatId,
            text,
            parse_mode: 'HTML',
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.description || `HTTP ${response.status}`);
        }
        return data;
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    if (failed.length > 0) {
      console.warn('Ayrim Telegram chatlarga xabar yetib bormadi:', failed.map(f => f.reason?.message));
    }

    return {
      success: successful.length > 0,
      totalSent: successful.length,
      failedCount: failed.length,
    };
  },

  /**
   * Send order notification
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
   * Send order cancellation notification to store owners
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
   * Send a test verification message to test bot connection
   */
  async sendTestMessage() {
    const testMessage = [
      `🔔 <b>Baza_Shop — Test Xabarnomasi</b>`,
      ``,
      `✅ Telegram Bot aloqasi muvaffaqiyatli o‘rnatildi!`,
      `📦 Yangi buyurtmalar tushganda barcha ma’lumotlar shu yerga keladi.`,
      `🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}`,
    ].join('\n');

    return await this.sendMessage(testMessage);
  },
};
