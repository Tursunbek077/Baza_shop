/**
 * Vercel Serverless Function — Telegram Xabarnoma Proksi
 * 
 * Bu funksiya faqat serverda (Node.js) ishlaydi.
 * Token hech qachon brauzerga (frontendga) chiqmaydi.
 */

// Xavfsiz server zaxira sozlamalari (agar Vercel Environment Variables kiritilmagan bo'lsa ham ishlaydi)
const DEFAULT_SERVER_BOT_TOKEN = '8920788343:AAEAxjc3ibdEA_ihjwhBNZqVeAj9qyzuDBQ';
const DEFAULT_SERVER_CHAT_IDS = '1240646588, 1460370215, 8360418500';

export default async function handler(req, res) {
  // CORS sarlavhalari
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Preflight so'rovlar uchun
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Faqat POST qabul qilinadi
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Faqat POST so‘rovi qabul qilinadi',
    });
  }

  // Tokenni Vercel muhitidan olamiz, topilmasa server zaxirasidan foydalanamiz
  const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_SERVER_BOT_TOKEN;
  if (!botToken) {
    console.error('XATOLIK: Telegram Bot Token topilmadi.');
    return res.status(500).json({
      ok: false,
      error: 'TELEGRAM_BOT_TOKEN serverda sozlanmagan.',
    });
  }

  try {
    const { text, chatId, parse_mode = 'HTML' } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Xabar matni (text) kiritilmagan.',
      });
    }

    // Chat ID larni aniqlash:
    // 1. So'rovdan kelgan chatId
    // 2. Yoki Vercel muhitidagi process.env.TELEGRAM_CHAT_ID
    // 3. Yoki server zaxirasidagi admin chat ID lar
    const rawChatIds = chatId || process.env.TELEGRAM_CHAT_ID || DEFAULT_SERVER_CHAT_IDS;

    // Chat ID larni massivga ajratish
    const targetChatIds = String(rawChatIds)
      .split(/[,;\s]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (targetChatIds.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Birorta ham yaroqli Chat ID topilmadi.',
      });
    }

    // Har bir adminga xabar yo'llash
    const results = await Promise.allSettled(
      targetChatIds.map(async (targetId) => {
        const telegramEndpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: targetId,
            text,
            parse_mode,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.description || `HTTP ${response.status}`);
        }
        return data;
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    // Agar hech bo'lmaganda 1 ta adminga xabar yetib borgan bo'lsa muvaffaqiyatli hisoblanadi
    if (successful.length === 0) {
      const errorMsg = failed[0]?.reason?.message || 'Telegram serveriga ulanib bo‘lmadi';
      return res.status(502).json({
        ok: false,
        error: `Telegram xatosi: ${errorMsg}`,
        details: failed.map((f) => f.reason?.message),
      });
    }

    return res.status(200).json({
      ok: true,
      totalSent: successful.length,
      failedCount: failed.length,
    });
  } catch (error) {
    console.error('Serverless Telegram xatosi:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Serverda kutilmagan xatolik yuz berdi',
    });
  }
}
