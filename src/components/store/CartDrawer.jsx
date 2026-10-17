import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { getColorHex } from '../../data/initialData';
import { t, translateColor, getLocalizedProductName } from '../../services/i18nService';

const formatUzbekPhone = (input) => {
  let digits = (input || '').replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `+998 (${digits}`;
  if (digits.length <= 5) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
};

const getRawPhoneDigits = (formatted) => {
  let digits = (formatted || '').replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  return digits.slice(0, 9);
};

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  activeCustomer,
  onOpenCustomerAuth,
  lang = 'uz',
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, phone: false, address: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Auto-fill checkout fields if customer is logged in
  React.useEffect(() => {
    if (activeCustomer && isOpen) {
      const fullName = `${activeCustomer.firstName || ''} ${activeCustomer.lastName || ''}`.trim();
      if (fullName) setName(fullName);
      if (activeCustomer.phone) setPhone(activeCustomer.phone);
      if (activeCustomer.address) setAddress(activeCustomer.address);
    }
  }, [activeCustomer, isOpen]);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Field validations
  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = getRawPhoneDigits(phone).length === 9;
  const isAddressValid = address.trim().length >= 5;
  const isFormValid = isNameValid && isPhoneValid && isAddressValid && cart.length > 0;

  const handlePhoneChange = (e) => {
    const formatted = formatUzbekPhone(e.target.value);
    setPhone(formatted);
  };

  const handlePhoneFocus = () => {
    if (!phone) {
      setPhone('+998 (');
    }
  };

  const handlePhoneBlur = () => {
    setTouched(prev => ({ ...prev, phone: true }));
    if (phone === '+998 (' || phone === '+998') {
      setPhone('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onCheckout({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: address.trim(),
        paymentMethod: lang === 'ru' ? 'По согласованию' : 'Kelishilgan holda',
        items: [...cart],
        totalAmount: total,
        orderDate: new Date().toISOString(),
      });

      // Reset form fields after successful order
      setName('');
      setPhone('');
      setAddress('');
      setTouched({ name: false, phone: false, address: false });
      setSubmitAttempted(false);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border-l border-rose-100 dark:border-stone-800 h-full flex flex-col p-4 sm:p-6 shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-rose-100 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif-luxury font-bold text-base sm:text-lg text-stone-900 dark:text-white">
              {t('cartTitle', lang)} ({cart.reduce((s, i) => s + i.qty, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg transition cursor-pointer"
            title={lang === 'ru' ? 'Закрыть' : 'Yopish'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        {cart.length === 0 ? (
          <div className="my-auto text-center text-stone-400 dark:text-stone-500 py-12">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-300" />
            <p className="font-serif-luxury text-base font-bold text-stone-700 dark:text-stone-300">
              {t('cartEmptyTitle', lang)}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {t('cartEmptyDesc', lang)}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto py-2">
            <div className="space-y-3 pb-3">
              {cart.map(item => {
                const itemId = item.cartItemId || `${item.id}-${item.selectedSize}-${item.selectedColor}`;
                const localizedItemName = getLocalizedProductName(item, lang);
                return (
                  <div
                    key={itemId}
                    className="flex gap-3 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-rose-100 dark:border-stone-800"
                  >
                    <img
                      src={item.image}
                      alt={localizedItemName}
                      className="w-16 h-20 object-cover rounded-xl shrink-0 border border-stone-200 dark:border-stone-700"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                            {localizedItemName}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(itemId)}
                            className="text-stone-400 hover:text-rose-500 p-0.5 cursor-pointer"
                            title={lang === 'ru' ? 'Удалить' : 'O‘chirish'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-600">
                            {lang === 'ru' ? 'Размер' : 'Razmer'}: {item.selectedSize || 'M'}
                          </span>
                          {item.selectedColor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded border border-rose-200 dark:border-rose-900/40">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                                style={{ backgroundColor: getColorHex(item.selectedColor) }}
                              />
                              <span>{translateColor(item.selectedColor, lang)}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-stone-900 dark:text-white font-mono">
                          {Number(item.price).toLocaleString('uz-UZ')} {t('som', lang)}
                        </span>

                        {/* Qty controls */}
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
                          <button
                            onClick={() => onUpdateQty(itemId, item.qty - 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(itemId, item.qty + 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="pt-4 border-t border-rose-100 dark:border-stone-800 space-y-3">
              {/* Customer Account Indicator */}
              {activeCustomer ? (
                <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {activeCustomer.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                        {activeCustomer.firstName} {activeCustomer.lastName}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block leading-none mt-0.5">
                        {lang === 'ru' ? 'Данные заполнены из профиля' : 'Maʼlumotlar profilingizdan to‘ldirildi'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    {lang === 'ru' ? 'Активен' : 'Faol'}
                  </span>
                </div>
              ) : (
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {lang === 'ru' ? 'Покупали ранее?' : 'Avval xarid qilganmisiz?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenCustomerAuth) onOpenCustomerAuth('login');
                    }}
                    className="text-rose-600 dark:text-rose-400 font-bold hover:underline text-xs cursor-pointer"
                  >
                    {lang === 'ru' ? 'Войти / Регистрация' : 'Kirish / Ro‘yxatdan o‘tish'}
                  </button>
                </div>
              )}

              {/* Total Summary */}
              <div className="space-y-1.5 pb-2">
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>{lang === 'ru' ? 'Доставка:' : 'Yetkazib berish:'}</span>
                  <span className="text-emerald-600 font-bold uppercase">
                    {lang === 'ru' ? 'Бесплатно (0 сум)' : 'Bepul (0 so‘m)'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 dark:text-white">
                  <span>{t('totalAmount', lang)}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono text-lg">
                    {total.toLocaleString('uz-UZ')} {t('som', lang)}
                  </span>
                </div>
              </div>

              {/* Inputs with real-time validation */}
              <div className="space-y-2.5">
                {/* 1. Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      {lang === 'ru' ? 'Ваше Имя' : 'Ismingiz'} <span className="text-rose-500">*</span>
                    </label>
                    {isNameValid && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {lang === 'ru' ? 'Верно' : 'To‘g‘ri'}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ru' ? 'Например: Мадина Каримова' : 'Masalan: Madina Karimova'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    className={`w-full bg-stone-50 dark:bg-stone-800 border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none transition ${
                      (touched.name || submitAttempted) && !isNameValid
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : isNameValid
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 focus:border-rose-500'
                    }`}
                  />
                  {(touched.name || submitAttempted) && !isNameValid && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">
                      {lang === 'ru'
                        ? 'Пожалуйста, введите имя (минимум 2 буквы)'
                        : 'Iltimos, ismingizni kiriting (kamida 2 ta harf)'}
                    </p>
                  )}
                </div>

                {/* 2. Phone with Uzbekistan Mask */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      {t('phoneLabel', lang)} <span className="text-rose-500">*</span>
                    </label>
                    {isPhoneValid && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {lang === 'ru' ? '9 цифр' : '9 ta raqam'}
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+998 (90) 123-45-67"
                    value={phone}
                    onChange={handlePhoneChange}
                    onFocus={handlePhoneFocus}
                    onBlur={handlePhoneBlur}
                    className={`w-full bg-stone-50 dark:bg-stone-800 border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-mono outline-none transition ${
                      (touched.phone || submitAttempted) && !isPhoneValid
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : isPhoneValid
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 focus:border-rose-500'
                    }`}
                  />
                  {(touched.phone || submitAttempted) && !isPhoneValid && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">
                      {phone
                        ? (lang === 'ru'
                            ? 'Введите номер полностью: +998 (__) ___-__-__'
                            : 'Telefon raqamni to‘liq kiriting: +998 (__) ___-__-__')
                        : (lang === 'ru'
                            ? 'Введите ваш номер телефона'
                            : 'Telefon raqamingizni kiriting')}
                    </p>
                  )}
                </div>

                {/* 3. Address */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      {t('addressLabel', lang)} <span className="text-rose-500">*</span>
                    </label>
                    {isAddressValid && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {lang === 'ru' ? 'Адрес указан' : 'Manzil kiritildi'}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={
                      lang === 'ru'
                        ? 'г. Ташкент, Чиланзарский р-н, кв-л 9, дом 12...'
                        : 'Shahar, tuman, ko‘cha, xonadon...'
                    }
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                    className={`w-full bg-stone-50 dark:bg-stone-800 border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none transition ${
                      (touched.address || submitAttempted) && !isAddressValid
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : isAddressValid
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 focus:border-rose-500'
                    }`}
                  />
                  {(touched.address || submitAttempted) && !isAddressValid && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">
                      {lang === 'ru'
                        ? 'Укажите точный адрес доставки (не менее 5 символов)'
                        : 'Yetkazish manzilini aniq kiriting (kamida 5 ta belgi)'}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('submittingOrder', lang)}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>{t('completeOrder', lang)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
