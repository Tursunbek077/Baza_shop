import React from 'react';
import { CheckCircle2, ShoppingBag, Sparkles, PhoneCall, Calendar, MapPin, User, FileText } from 'lucide-react';
import { getColorHex } from '../../data/initialData';
import { t, translateColor, getLocalizedProductName } from '../../services/i18nService';

export default function OrderSuccessModal({ order, isOpen, onClose, lang = 'uz' }) {
  if (!isOpen || !order) return null;

  const orderCode = order.id
    ? `#BZ-${String(order.id).padStart(4, '0')}`
    : `#BZ-${order.orderNumber || '104'}`;

  const localeCode = lang === 'ru' ? 'ru-RU' : 'uz-UZ';
  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString(localeCode, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString(localeCode, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 w-full max-w-lg rounded-3xl p-5 sm:p-7 text-center shadow-2xl relative overflow-hidden max-h-[94vh] flex flex-col">
        {/* Glow backdrop */}
        <div className="w-32 h-32 bg-rose-500/10 rounded-full blur-3xl absolute -top-8 -left-8 pointer-events-none"></div>

        {/* Scrollable Receipt Body */}
        <div className="overflow-y-auto flex-1 pr-1 -mr-1 space-y-4">
          {/* Header Icon & Title */}
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto mb-3 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/40 mb-2">
              <Sparkles className="w-3 h-3" /> {lang === 'ru' ? 'Официальная Квитанция Подтверждена' : 'Rasmiy Kvitansiya Tasdiqlandi'}
            </div>

            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {lang === 'ru'
                ? `Спасибо, ${order.customerName || 'Уважаемый Покупатель'}!`
                : `Tashakkur, ${order.customerName || 'Hurmatli Xaridor'}!`}
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              {lang === 'ru' ? (
                <>Ваш заказ успешно принят в систему <strong>Baza_Shop</strong>. Скоро наш менеджер свяжется с вами.</>
              ) : (
                <>Buyurtmangiz <strong>Baza_Shop</strong> tizimiga muvaffaqiyatli qabul qilindi. Tez orada menejerimiz siz bilan bog‘lanadi.</>
              )}
            </p>
          </div>

          {/* Official Receipt Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-left space-y-3.5 text-xs shadow-inner">
            {/* Receipt Number & Date */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-stone-200 dark:border-stone-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">
                  {lang === 'ru' ? 'Номер Заказа:' : 'Buyurtma Raqami:'}
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                  {orderCode}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">
                  {lang === 'ru' ? 'Дата & Время:' : 'Sana & Vaqt:'}
                </span>
                <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" /> {lang === 'ru' ? 'Покупатель:' : 'Xaridor:'}
                </span>
                <span className="font-semibold text-stone-900 dark:text-white">
                  {order.customerName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-stone-400" /> {lang === 'ru' ? 'Телефон:' : 'Telefon:'}
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">
                  {order.customerPhone}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> {lang === 'ru' ? 'Адрес:' : 'Manzil:'}
                </span>
                <span className="font-medium text-stone-900 dark:text-white text-right">
                  {order.deliveryAddress}
                </span>
              </div>
            </div>

            {/* Ordered Garments Breakdown */}
            {order.items && order.items.length > 0 && (
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                    {lang === 'ru'
                      ? `Выбранные наряды (${order.items.reduce((s, i) => s + (i.qty || 1), 0)} шт)`
                      : `Tanlangan Liboslar (${order.items.reduce((s, i) => s + (i.qty || 1), 0)} dona)`}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {order.items.map((it, idx) => {
                    const colorHex = it.selectedColor ? getColorHex(it.selectedColor) : null;
                    const localizedItemName = getLocalizedProductName(it, lang);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700"
                      >
                        {it.image ? (
                          <img
                            src={it.image}
                            alt={localizedItemName}
                            className="w-11 h-13 object-cover rounded-lg shrink-0 border border-stone-200 dark:border-stone-700"
                          />
                        ) : (
                          <div className="w-11 h-13 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-4 h-4 text-stone-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                            {localizedItemName}
                          </h4>

                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-600">
                              {lang === 'ru' ? 'Размер' : 'Razmer'}: {it.selectedSize || 'M'}
                            </span>

                            {it.selectedColor && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded border border-rose-200 dark:border-rose-900/30">
                                {colorHex && (
                                  <span
                                    className="w-2 h-2 rounded-full border border-black/15 shrink-0"
                                    style={{ backgroundColor: colorHex }}
                                  />
                                )}
                                <span>{translateColor(it.selectedColor, lang)}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="text-stone-500 dark:text-stone-400 font-mono">
                              {it.qty} × {Number(it.price).toLocaleString('uz-UZ')} {t('som', lang)}
                            </span>
                            <span className="font-mono font-bold text-stone-900 dark:text-white">
                              {Number(it.price * it.qty).toLocaleString('uz-UZ')} {t('som', lang)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-700 space-y-1 text-xs">
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>{lang === 'ru' ? 'Служба доставки:' : 'Yetkazib berish xizmati:'}</span>
                <span className="text-emerald-600 font-bold uppercase">
                  {lang === 'ru' ? 'Бесплатно (0 сум)' : 'Bepul (0 so‘m)'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-stone-200 dark:border-stone-700 text-sm font-bold">
                <span className="text-stone-900 dark:text-white">
                  {lang === 'ru' ? 'Итоговая Сумма к Оплате:' : 'Jami To‘lov Summasi:'}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-mono text-base">
                  {Number(order.totalAmount || 0).toLocaleString('uz-UZ')} {t('som', lang)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ru' ? 'Продолжить покупки' : 'Xaridni Davom Ettirish'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
