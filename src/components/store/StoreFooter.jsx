import React from 'react';
import { Crown, Lock, Phone, MapPin, Send, Sun, Moon } from 'lucide-react';
import { t } from '../../services/i18nService';

export default function StoreFooter({ onOpenAdminLogin, isDark, onToggleTheme, lang = 'uz' }) {
  return (
    <footer id="aloqa" className="bg-white dark:bg-stone-950 border-t border-rose-100 dark:border-stone-800 pt-8 sm:pt-16 pb-6 sm:pb-12 transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {/* 4 Columns Side-by-Side on both Mobile and Desktop */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-6 md:gap-8 lg:gap-10 mb-6 sm:mb-12 w-full max-w-full">
          {/* Col 1: Brand */}
          <div className="space-y-1 sm:space-y-4 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-3 min-w-0">
              <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-md sm:rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs shrink-0">
                <Crown className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <span className="font-serif-luxury font-bold tracking-wider text-[11px] sm:text-xl text-stone-900 dark:text-white uppercase truncate">
                Baza_Shop
              </span>
            </div>
            <p className="text-[8px] sm:text-xs text-stone-500 dark:text-stone-400 leading-tight sm:leading-relaxed break-words">
              {t('footerBrandDesc', lang)}
            </p>
          </div>

          {/* Col 2: Kolleksiyalar */}
          <div className="space-y-1 sm:space-y-3 min-w-0 overflow-hidden">
            <h4 className="font-serif-luxury font-bold text-[9px] sm:text-sm text-stone-900 dark:text-white uppercase tracking-tight sm:tracking-wider truncate">
              {t('footerColCollections', lang)}
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-[8px] sm:text-xs text-stone-600 dark:text-stone-400 leading-tight sm:leading-relaxed">
              <li><a href="#katalog" className="hover:text-rose-600 transition block truncate">{lang === 'ru' ? 'Платья' : 'Ko‘ylaklar'}</a></li>
              <li><a href="#katalog" className="hover:text-rose-600 transition block truncate">{lang === 'ru' ? 'Костюмы' : 'Kostyumlar'}</a></li>
              <li><a href="#katalog" className="hover:text-rose-600 transition block truncate">{lang === 'ru' ? 'Блузки' : 'Bluzkalar'}</a></li>
              <li><a href="#katalog" className="hover:text-rose-600 transition block truncate">{lang === 'ru' ? 'Пальто' : 'Paltolar'}</a></li>
            </ul>
          </div>

          {/* Col 3: Mijozlarga Xizmat */}
          <div className="space-y-1 sm:space-y-3 min-w-0 overflow-hidden">
            <h4 className="font-serif-luxury font-bold text-[9px] sm:text-sm text-stone-900 dark:text-white uppercase tracking-tight sm:tracking-wider truncate">
              <span className="hidden sm:inline">{lang === 'ru' ? 'Клиентский ' : 'Mijozlarga '}</span>{t('footerColServices', lang)}
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-[8px] sm:text-xs text-stone-600 dark:text-stone-400 leading-tight sm:leading-relaxed">
              <li className="truncate">{lang === 'ru' ? 'Доставка' : 'Yetkazish'}</li>
              <li className="truncate">{lang === 'ru' ? 'Размеры' : 'O‘lcham'}</li>
              <li className="truncate">{lang === 'ru' ? 'Гарантия' : 'Kafolat'}</li>
              <li className="truncate">{lang === 'ru' ? 'Правила' : 'Qoidalar'}</li>
            </ul>
          </div>

          {/* Col 4: Aloqa va Manzil */}
          <div className="space-y-1 sm:space-y-3 min-w-0 overflow-hidden">
            <h4 className="font-serif-luxury font-bold text-[9px] sm:text-sm text-stone-900 dark:text-white uppercase tracking-tight sm:tracking-wider truncate">
              <span className="hidden sm:inline">{lang === 'ru' ? 'Контакты ' : 'Butik bilan '}</span>{t('footerColContact', lang)}
            </h4>
            <div className="space-y-1 sm:space-y-2 text-[8px] sm:text-xs text-stone-600 dark:text-stone-400 leading-tight sm:leading-relaxed">
              <p className="flex items-center gap-1 sm:gap-2 truncate">
                <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">90 974-60-40</span>
              </p>
              <p className="flex items-center gap-1 sm:gap-2 truncate">
                <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{t('footerCity', lang)}</span>
              </p>
              <p className="flex items-center gap-1 sm:gap-2 truncate">
                <Send className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">@baza_shop</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet discreet lock link and theme */}
        <div className="pt-3 sm:pt-8 border-t border-rose-100 dark:border-stone-800 flex flex-row items-center justify-between gap-1 text-[8px] sm:text-xs text-stone-500 dark:text-stone-400 w-full max-w-full">
          <p className="truncate">{t('footerCopyright', lang)}</p>

          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-0.5 sm:gap-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition text-[8px] sm:text-[11px] cursor-pointer"
                title={lang === 'ru' ? 'Переключить тему оформления' : 'Sayt ko‘rinish rejimini o‘zgartirish'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-2.5 h-2.5 sm:w-3 text-amber-400 shrink-0" />
                    <span>{lang === 'ru' ? 'Светлая' : 'Yorug‘'}<span className="hidden sm:inline"> {lang === 'ru' ? 'тема' : 'rejim'}</span></span>
                  </>
                ) : (
                  <>
                    <Moon className="w-2.5 h-2.5 sm:w-3 text-stone-400 shrink-0" />
                    <span>{lang === 'ru' ? 'Темная' : 'Tungi'}<span className="hidden sm:inline"> {lang === 'ru' ? 'тема' : 'rejim'}</span></span>
                  </>
                )}
              </button>
            )}
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-0.5 sm:gap-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition text-[8px] sm:text-[11px] cursor-pointer"
              title={lang === 'ru' ? 'Только для сотрудников бутика' : 'Faqat butik xodimlari uchun'}
            >
              <Lock className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
              <span>{lang === 'ru' ? 'Вход для сотрудников' : 'Xodimlar kirishi'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
