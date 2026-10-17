import React, { useState, useEffect } from 'react';
import { User, Phone, Lock, Eye, EyeOff, MapPin, X, ArrowRight, ArrowLeft, Check, ShieldAlert, Sparkles, LogIn, UserPlus, Heart } from 'lucide-react';
import { customerAuthService } from '../../services/customerAuthService';
import { t } from '../../services/i18nService';

const formatUzbekPhone = (value) => {
  let digits = (value || '').replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);
  if (!digits) return '';
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

export default function CustomerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  lang = 'uz',
  promptMessage = '',
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [regStep, setRegStep] = useState(1); // 1: credentials, 2: personal info

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setRegStep(1);
      setError('');
    }
  }, [isOpen, initialMode]);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    const formatted = formatUzbekPhone(e.target.value);
    setPhone(formatted);
    if (error) setError('');
  };

  const handlePhoneFocus = () => {
    if (!phone) setPhone('+998 (');
  };

  const handlePhoneBlur = () => {
    if (phone === '+998 (' || phone === '+998') {
      setPhone('');
    }
  };

  // Step 1 to Step 2 validation
  const handleNextStep = (e) => {
    e.preventDefault();
    const digits = getRawPhoneDigits(phone);
    if (digits.length !== 9) {
      setError(
        lang === 'ru'
          ? 'Пожалуйста, введите полный номер телефона (9 цифр).'
          : 'Iltimos, 9 xonali to‘liq telefon raqamingizni kiriting.'
      );
      return;
    }
    if (password.length < 4) {
      setError(
        lang === 'ru'
          ? 'Пароль должен состоять минимум из 4 символов.'
          : 'Parol kamida 4 ta belgidan iborat bo‘lishi kerak.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(
        lang === 'ru'
          ? 'Введенные пароли не совпадают.'
          : 'Kiritilgan parollar bir-biriga mos kelmadi.'
      );
      return;
    }

    setError('');
    setRegStep(2);
  };

  // Complete Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || firstName.trim().length < 2) {
      setError(
        lang === 'ru'
          ? 'Пожалуйста, введите имя (минимум 2 буквы).'
          : 'Iltimos, ismingizni kiriting (kamida 2 harf).'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const profile = await customerAuthService.register({
        phone,
        password,
        firstName,
        lastName,
        address,
      });

      if (onSuccess) onSuccess(profile);
      onClose();
    } catch (err) {
      setError(err.message || (lang === 'ru' ? 'Ошибка при регистрации.' : 'Ro‘yxatdan o‘tishda xatolik yuz berdi.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const digits = getRawPhoneDigits(phone);
    if (digits.length !== 9) {
      setError(
        lang === 'ru'
          ? 'Пожалуйста, введите номер телефона полностью.'
          : 'Iltimos, telefon raqamingizni to‘liq kiriting.'
      );
      return;
    }
    if (!password) {
      setError(lang === 'ru' ? 'Введите ваш пароль.' : 'Parolingizni kiriting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const profile = await customerAuthService.login({
        phone,
        password,
      });

      if (onSuccess) onSuccess(profile);
      onClose();
    } catch (err) {
      setError(err.message || (lang === 'ru' ? 'Ошибка при входе.' : 'Kirishda xatolik yuz berdi.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setRegStep(1);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl relative scrollbar-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition cursor-pointer"
          title={lang === 'ru' ? 'Закрыть' : 'Yopish'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Optional Context Prompt (e.g., Wishlist requirement) */}
        {promptMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800 shadow-xs">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <p className="font-medium leading-relaxed flex-1">
              {promptMessage}
            </p>
          </div>
        )}

        {/* Header Tabs: Kirish vs Ro'yxatdan o'tish */}
        <div className="flex border-b border-rose-100 dark:border-stone-800 pb-3 mb-6">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 pb-2 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 border-b-2 -mb-3.5 cursor-pointer ${
              mode === 'login'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t('login', lang)}</span>
          </button>

          <button
            onClick={() => switchMode('register')}
            className={`flex-1 pb-2 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 border-b-2 -mb-3.5 cursor-pointer ${
              mode === 'register'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('register', lang)}</span>
          </button>
        </div>

        {/* Modal Subtitle / Step Indicator */}
        {mode === 'register' && (
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {regStep === 1
                ? (lang === 'ru' ? 'Шаг 1: Телефон и Пароль' : '1-Bosqich: Telefon & Parol')
                : (lang === 'ru' ? 'Шаг 2: Личные данные' : '2-Bosqich: Shaxsiy ma’lumotlar')}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              {regStep}/2
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Номер Телефона' : 'Telefon Raqam'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+998 (90) 123-45-67"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={handlePhoneFocus}
                  onBlur={handlePhoneBlur}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-mono outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Пароль' : 'Parol'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={lang === 'ru' ? 'Введите пароль' : 'Parolingizni kiriting'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? (lang === 'ru' ? 'Вход...' : 'Kirilmoqda...')
                : (lang === 'ru' ? 'Войти в аккаунт' : 'Hisobga Kirish')}
            </button>
          </form>
        )}

        {/* Mode 2: REGISTER FORM - STEP 1 (Phone & Password) */}
        {mode === 'register' && regStep === 1 && (
          <form onSubmit={handleNextStep} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Номер Телефона' : 'Telefon Raqam'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+998 (90) 123-45-67"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={handlePhoneFocus}
                  onBlur={handlePhoneBlur}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-mono outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Придумайте пароль' : 'Parol yarating'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={lang === 'ru' ? 'Не менее 4 символов' : 'Kamida 4 ta belgi'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Повторите пароль' : 'Parolni qayta kiriting'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={lang === 'ru' ? 'Подтвердите пароль' : 'Parolni tasdiqlang'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'ru' ? 'Следующий шаг' : 'Keyingi bosqich'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mode 2: REGISTER FORM - STEP 2 (Personal Info & Address) */}
        {mode === 'register' && regStep === 2 && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ru' ? 'Ваше Имя' : 'Ismingiz'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={lang === 'ru' ? 'Малика' : 'Malika'}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ru' ? 'Фамилия' : 'Familiyangiz'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ru' ? 'Каримова' : 'Karimova'}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Адрес доставки' : 'Yetkazib berish manzili'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    lang === 'ru'
                      ? 'г. Ташкент, ул. Навои, дом 10...'
                      : 'Shahar, tuman, ko‘cha, xonadon...'
                  }
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                {lang === 'ru'
                  ? 'Этот адрес будет автоматически подставляться в ваши заказы.'
                  : 'Ushbu manzil keyingi barcha buyurtmalaringizda avtomatik to‘ldiriladi.'}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRegStep(1)}
                className="py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'ru' ? 'Назад' : 'Orqaga'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{lang === 'ru' ? 'Сохранение...' : 'Saqlanmoqda...'}</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Завершить регистрацию' : 'Ro‘yxatdan o‘tishni yakunlash'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
