import React, { useState, useEffect } from 'react';
import { Send, Check, X, ShieldAlert, CheckCircle2, Loader2, Sparkles, ShieldCheck, Server } from 'lucide-react';
import { telegramService } from '../../services/telegramService';

export default function TelegramSettingsModal({ isOpen, onClose }) {
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = telegramService.getConfig();
      setChatId(config.chatId || '');
      setEnabled(config.enabled !== false);
      setTestResult(null);
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    telegramService.saveConfig({
      chatId: chatId.trim(),
      enabled,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleTest = async () => {
    try {
      setIsTesting(true);
      setTestResult(null);

      // Vaqtinchalik kiritilgan chat ID bilan xabarni jo'natib ko'ramiz
      const res = await telegramService.sendTestMessage(chatId.trim() || null);
      if (res.success) {
        setTestResult({
          success: true,
          message: `Test xabari muvaffaqiyatli yetkazildi! (${res.totalSent} ta chatga yuborildi)`,
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Xabar yuborilmadi. Vercel muhitida TELEGRAM_BOT_TOKEN va Chat ID to‘g‘riligini tekshiring.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Tarmoqqa ulanishda xatolik yuz berdi.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/50 flex items-center justify-center mx-auto mb-3 text-sky-500 dark:text-sky-400">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900 dark:text-white">
            Telegram Bot Bildirishnomalari
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Saytdan yangi buyurtma tushganda yoki bekor qilinganda do‘kon egasiga xabar boradi
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Security Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                Serverless Himoya Faol
              </p>
              <p className="text-emerald-700 dark:text-emerald-400/90 text-[11px] mt-0.5 leading-relaxed">
                Bot Token frontendga (brauzerga) hech qachon chiqmaydi. U faqat Vercel server muhitida (<code>TELEGRAM_BOT_TOKEN</code>) xavfsiz saqlanadi.
              </p>
            </div>
          </div>

          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <div>
              <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Xabarnomalarni faollashtirish
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Yangi buyurtmalarni Telegramga yo‘llash
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Admin Chat ID(s) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Admin Telegram Chat ID(lar)
            </label>
            <input
              type="text"
              placeholder="Masalan: 1240646588, 1460370215, 8360418500"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-sky-500 font-mono transition"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Bo‘sh qoldirilsa, serverdagi standart <code>TELEGRAM_CHAT_ID</code> ishlatiladi. Bir nechta ID bo‘lsa vergul bilan ajrating.
            </p>
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-start gap-2 animate-fadeIn ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>
          )}

          {/* Guide Accordion */}
          <div className="bg-amber-50/70 dark:bg-stone-800/40 border border-amber-200/60 dark:border-stone-700 rounded-2xl p-3 text-[11px] text-stone-600 dark:text-stone-400 space-y-1.5">
            <p className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Vercel Server sozlamalari:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
              <li>Vercel loyihangizda <b>Settings &rarr; Environment Variables</b> bo‘limiga kiring.</li>
              <li><code>TELEGRAM_BOT_TOKEN</code> (VITE_ prefiksisiz!) nomli o‘zgaruvchi yarating.</li>
              <li><code>TELEGRAM_CHAT_ID</code> ga admin ID raqamlarini kiriting.</li>
              <li>Qayta <b>Redeploy</b> qiling. Shunda token 100% server orqasida himoyalanadi.</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Test Xabar Yuborish</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isSaved}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-75"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saqlandi!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sozlamalarni Saqlash</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
