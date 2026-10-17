import React from 'react';
import { Crown, ShoppingBag, Heart, Search, Lock, User, Sun, Moon } from 'lucide-react';
import { t } from '../../services/i18nService';

export default function StoreHeader({
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  onOpenAdminLogin,
  onReplayIntro,
  activeCustomer,
  onOpenCustomerAuth,
  onOpenCustomerProfile,
  isDark,
  onToggleTheme,
  lang = 'uz',
  onToggleLang,
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(Boolean(searchQuery));

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-rose-100 py-1.5 sm:py-2 px-2 min-[470px]:px-3 sm:px-6 text-[10px] sm:text-[11px] md:text-xs font-medium border-b border-rose-900/30 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 min-w-0">
          <span className="truncate flex items-center gap-1.5 text-rose-200 shrink min-w-0">
            {t('deliveryNotice', lang)}
          </span>
          <div className="flex items-center gap-1 min-[470px]:gap-1.5 sm:gap-2.5 md:gap-3 shrink-0 whitespace-nowrap text-[10px] sm:text-xs">
            {activeCustomer ? (
              <button
                onClick={onOpenCustomerProfile}
                className="inline-flex items-center gap-1 text-rose-300 hover:text-white transition"
              >
                <span>{t('customerGreeting', lang)}, {activeCustomer.firstName}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 min-[470px]:gap-1.5 sm:gap-2 text-rose-300">
                <button
                  onClick={() => onOpenCustomerAuth && onOpenCustomerAuth('login')}
                  className="hover:text-white transition"
                >
                  {t('login', lang)}
                </button>
                <span>•</span>
                <button
                  onClick={() => onOpenCustomerAuth && onOpenCustomerAuth('register')}
                  className="hover:text-white underline underline-offset-2 transition font-semibold"
                >
                  {t('register', lang)}
                </button>
              </div>
            )}
            <span className="text-rose-300/60">|</span>
            <a
              href="tel:+998909746040"
              className="inline-flex items-center gap-1 text-rose-300 hover:text-white transition"
            >
              <span className="hidden min-[470px]:inline">📞 +998 (90) 974-60-40</span>
              <span className="min-[470px]:hidden">📞 974-60-40</span>
            </a>
            {/* Secret discreet lock button for store owner */}
            <button
              onClick={onOpenAdminLogin}
              className="text-rose-400/60 hover:text-white p-0.5 sm:p-1 transition"
              title="Do‘kon egasi kirishi"
            >
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-rose-100 dark:border-stone-800 transition-colors shadow-xs w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 min-[470px]:px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-14 min-[470px]:h-16 sm:h-20 gap-1 min-[470px]:gap-2 w-full min-w-0">
            {/* Brand Logo */}
            <div className="flex items-center gap-1 min-[470px]:gap-2 sm:gap-2.5 shrink min-w-0">
              <div
                onClick={onOpenAdminLogin}
                className="store-brand-logo w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/25 cursor-pointer shrink-0"
                title="Baza_Shop"
              >
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div
                onClick={onReplayIntro}
                className="cursor-pointer select-none group shrink min-w-0"
                title="Kinematik Introni tomosha qilish"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                  <span className="store-brand-title font-serif-luxury text-base sm:text-xl lg:text-2xl font-bold tracking-wider text-stone-900 dark:text-white uppercase leading-none group-hover:text-rose-600 transition">
                    Baza_Shop
                  </span>
                  <span className="store-brand-intro-badge inline-flex text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-full font-bold shrink-0 tracking-normal leading-none shadow-2xs">
                    ▶ Intro
                  </span>
                </div>
                <p className="store-brand-subtitle text-[9px] sm:text-[10px] text-rose-600 dark:text-rose-400 tracking-widest uppercase font-semibold mt-0.5 whitespace-nowrap">
                  Haute Couture • Butik
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8 text-xs xl:text-sm font-medium text-stone-700 dark:text-stone-300 shrink-0">
              <a href="#hero" className="hover:text-rose-600 transition whitespace-nowrap">{t('navHome', lang)}</a>
              <a href="#katalog" className="hover:text-rose-600 transition whitespace-nowrap">{t('navCollection', lang)}</a>
              <a href="#afzalliklar" className="hover:text-rose-600 transition whitespace-nowrap">{t('navFeatures', lang)}</a>
              <a href="#aloqa" className="hover:text-rose-600 transition whitespace-nowrap">{t('navContact', lang)}</a>
            </nav>

            {/* Actions: Search, Wishlist, Theme, Profile, Cart */}
            <div className="store-header-actions flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
              {/* Desktop Quick Search - Shown on XL screens (1280px+) */}
              <div className="relative hidden xl:block w-48 2xl:w-60">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder', lang)}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-stone-100/80 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-400 transition"
                />
              </div>

              {/* Mobile & Tablet Search Toggle Button (<1280px) */}
              <button
                onClick={() => setIsMobileSearchOpen(prev => !prev)}
                className={`xl:hidden store-header-action-btn p-1.5 min-[470px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition ${
                  isMobileSearchOpen || searchQuery
                    ? 'text-rose-600 bg-rose-50 dark:bg-stone-800'
                    : 'text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-900'
                }`}
                title={t('searchPlaceholder', lang)}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist button */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="store-header-action-btn relative p-1.5 min-[470px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-900 transition active:scale-95 cursor-pointer"
                title={t('wishlist', lang)}
                aria-label={t('wishlist', lang)}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500 scale-105' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 min-[470px]:w-4 min-[470px]:h-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full text-[9px] min-[470px]:text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Discreet Dark/Light Mode Toggle for Customer */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="store-header-action-btn p-1.5 min-[470px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-stone-600 dark:text-stone-300 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-stone-900 transition active:scale-95"
                  title={isDark ? t('lightMode', lang) : t('darkMode', lang)}
                  aria-label="Tungi rejimni yoqish yoki o‘chirish"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600 dark:text-stone-300" />
                  )}
                </button>
              )}

              {/* Customer Account / Profile Button */}
              {activeCustomer ? (
                <button
                  onClick={onOpenCustomerProfile}
                  className="store-header-action-btn inline-flex items-center gap-1.5 p-1 min-[470px]:p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-stone-900 hover:bg-rose-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-rose-200 dark:border-stone-800 transition active:scale-95 group shrink-0"
                  title={t('cabinetTitle', lang)}
                >
                  <div className="w-4 h-4 min-[470px]:w-5 min-[470px]:h-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-[9px] min-[470px]:text-[10px] font-bold shrink-0 shadow-xs">
                    {activeCustomer.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden xl:inline text-xs font-semibold max-w-[85px] truncate">
                    {activeCustomer.firstName}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenCustomerAuth && onOpenCustomerAuth('login')}
                  className="store-header-action-btn inline-flex items-center gap-1.5 p-1.5 min-[470px]:p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition active:scale-95 group shrink-0"
                  title={t('login', lang)}
                >
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-500 group-hover:text-rose-600 transition" />
                  <span className="hidden xl:inline">{t('login', lang)}</span>
                </button>
              )}

              {/* Language Switcher Button (UZB / RUS) directly next to Cart */}
              {onToggleLang && (
                <button
                  type="button"
                  onClick={onToggleLang}
                  className="store-lang-btn inline-flex items-center gap-0.5 min-[470px]:gap-1 px-1.5 py-1 min-[470px]:px-2 min-[470px]:py-1.5 sm:px-2.5 sm:py-2 rounded-xl sm:rounded-2xl bg-stone-100 dark:bg-stone-900 hover:bg-rose-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 text-[9px] min-[470px]:text-[10px] sm:text-xs font-bold transition active:scale-95 shrink-0 shadow-2xs"
                  title={lang === 'uz' ? "Русский язык (RU)" : "O‘zbek tili (UZ)"}
                  aria-label="Tilni o‘zgartirish / Сменить язык"
                >
                  <span className={lang === 'uz' ? "text-rose-600 dark:text-rose-400 font-black" : "text-stone-400 dark:text-stone-500 font-medium"}>UZ</span>
                  <span className="text-stone-300 dark:text-stone-700 text-[8px] min-[470px]:text-[9px]">/</span>
                  <span className={lang === 'ru' ? "text-rose-600 dark:text-rose-400 font-black" : "text-stone-400 dark:text-stone-500 font-medium"}>RU</span>
                </button>
              )}

              {/* Shopping Bag CTA */}
              <button
                onClick={onOpenCart}
                className="store-cart-btn relative inline-flex items-center gap-1 min-[470px]:gap-1.5 sm:gap-2 px-2 py-1.5 min-[470px]:px-2.5 min-[470px]:py-2 sm:px-3.5 sm:py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white text-[11px] min-[470px]:text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl shadow-md shadow-rose-600/25 transition active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 min-[470px]:w-4 min-[470px]:h-4" />
                <span className="hidden xl:inline">{t('cart', lang)}</span>
                <span className="w-4 h-4 min-[470px]:w-5 min-[470px]:h-5 bg-white text-rose-700 rounded-full text-[10px] min-[470px]:text-xs font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Search Dropdown Bar for screens under XL (<1280px) */}
          {isMobileSearchOpen && (
            <div className="xl:hidden pb-3 pt-1 animate-fadeIn">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Libos yoki kategoriya qidirish..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full pl-9 pr-8 py-2 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold p-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
