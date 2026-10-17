import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Lokal rejimda (npm run dev) /api/telegram so'rovlarini to'g'ridan-to'g'ri
 * Node.js serverida qabul qilib Telegram API ga uzatuvchi dev middleware.
 * Productionda (Vercel) esa avtomatik ravishda api/telegram.js ishga tushadi.
 */
function telegramDevProxyPlugin() {
  return {
    name: 'telegram-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/telegram', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Faqat POST so‘rovi ruxsat etilgan' }));
          return;
        }

        // .env faylidan server o'zgaruvchilarini yuklaymiz (VITE_ prefiksisiz ham o'qiydi)
        const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
        const botToken = env.TELEGRAM_BOT_TOKEN;
        const defaultChatId = env.TELEGRAM_CHAT_ID;

        if (!botToken) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: false,
              error: 'Lokal .env faylida TELEGRAM_BOT_TOKEN topilmadi.',
            })
          );
          return;
        }

        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyRaw ? JSON.parse(bodyRaw) : {};
            const text = body.text;
            const targetChatIds = (body.chatId || defaultChatId || '')
              .split(/[,;\s]+/)
              .map((id) => id.trim())
              .filter(Boolean);

            if (!text || targetChatIds.length === 0) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: false,
                  error: 'Xabar matni yoki Chat ID yetishmaydi.',
                })
              );
              return;
            }

            const results = await Promise.allSettled(
              targetChatIds.map(async (targetId) => {
                const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: targetId,
                    text,
                    parse_mode: body.parse_mode || 'HTML',
                  }),
                });
                const data = await tgRes.json();
                if (!tgRes.ok || !data.ok) {
                  throw new Error(data.description || `HTTP ${tgRes.status}`);
                }
                return data;
              })
            );

            const successful = results.filter((r) => r.status === 'fulfilled');
            const failed = results.filter((r) => r.status === 'rejected');

            if (successful.length === 0) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: false,
                  error: failed[0]?.reason?.message || 'Telegramga yetkazib berilmadi',
                })
              );
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: true,
                totalSent: successful.length,
                failedCount: failed.length,
              })
            );
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err.message || 'Lokal proxy xatosi' }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    telegramDevProxyPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            return 'vendor-libs';
          }
        },
      },
    },
  },
});
