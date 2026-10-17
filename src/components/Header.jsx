import React from 'react';
import { Sparkles, Eye, PlusCircle, Crown, Sun, Moon } from 'lucide-react';

export default function Header({ isDark, onToggleTheme, onOpenNewProduct, onTogglePreview, productCount }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-rose-100 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-serif-luxury text-base sm:text-xl font-bold tracking-wider text-stone-900 dark:text-white uppercase truncate">
                  Baza_Shop
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-full items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-rose-500" /> Ayollar Butigi
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 dark:text-stone-400 truncate">
                Premium ayollar liboslari & vitrina boshqaruvi
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 hover:bg-rose-50 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-xl transition shadow-xs active:scale-95"
              title={isDark ? 'Yorug‘ rejimga (Light Mode) o‘tish' : 'Qorong‘i rejimga (Dark Mode) o‘tish'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Yorug‘</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-rose-600" />
                  <span className="hidden md:inline">Qorong‘i</span>
                </>
              )}
            </button>

            {/* Customer preview */}
            <button
              onClick={onTogglePreview}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white hover:bg-rose-50/60 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-rose-200 dark:border-stone-700 rounded-xl transition shadow-xs active:scale-95"
              title="Xaridor saytni qanday ko'rishini ochish"
            >
              <Eye className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">Vitrina (Preview)</span>
            </button>

            {/* Add product */}
            <button
              onClick={onOpenNewProduct}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl transition shadow-md shadow-rose-600/25 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Yangi Libos</span>
              <span className="sm:hidden">+ Libos</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
