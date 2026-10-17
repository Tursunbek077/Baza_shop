import React from 'react';
import { ArrowRight, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { t, getLocalizedProductName } from '../../services/i18nService';

export default function StoreHero({ banner, heroProduct, onAddToCart, onQuickBuy, lang = 'uz' }) {
  if (!heroProduct) return null;

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-rose-950 to-stone-950 border border-rose-900/40 shadow-2xl p-6 sm:p-14 lg:p-16 min-h-[460px] lg:min-h-[520px] flex flex-col justify-center">
        {/* Glamour Background Fashion Image */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 lg:w-3/5 opacity-35 sm:opacity-90 pointer-events-none">
          <img
            src={heroProduct.image}
            alt={heroProduct.name}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-stone-900 via-transparent to-transparent"></div>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 text-xs font-bold bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 text-stone-950 rounded-full tracking-wider uppercase shadow-md">
              {lang === 'ru' ? (banner.discountBadgeRu || t('heroExclusiveBadge', 'ru')) : (banner.discountBadge || t('heroExclusiveBadge', 'uz'))}
            </span>
            <span className="text-xs text-rose-300 font-semibold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-rose-800/40 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              {lang === 'ru' ? (banner.badgeTextRu || t('heroWeekFavorite', 'ru')) : (banner.badgeText || t('heroWeekFavorite', 'uz'))}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm uppercase tracking-widest text-rose-400 font-bold">
            {lang === 'ru' ? (banner.taglineRu || t('heroTagline', 'ru')) : (banner.tagline || t('heroTagline', 'uz'))}
          </p>

          {/* Headline */}
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
            {lang === 'ru' ? (banner.headlineRu || t('heroHeadline', 'ru')) : (banner.headline || t('heroHeadline', 'uz'))}
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-rose-100/90 font-light leading-relaxed max-w-lg">
            {lang === 'ru' ? (banner.subheadlineRu || t('heroSubheadline', 'ru')) : (banner.subheadline || t('heroSubheadline', 'uz'))}
          </p>

          {/* Price Box */}
          <div className="pt-1 flex items-baseline gap-3">
            <span className="text-2xl sm:text-4xl font-bold text-amber-300 font-mono drop-shadow-sm">
              {Number(heroProduct.price).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ')} {t('som', lang)}
            </span>
            {heroProduct.oldPrice && (
              <span className="text-sm sm:text-lg text-stone-400 line-through font-mono">
                {Number(heroProduct.oldPrice).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ')} {t('som', lang)}
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onQuickBuy(heroProduct)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition-all active:scale-95"
            >
              <span>{lang === 'ru' ? (banner.buttonTextRu || t('heroBuyButton', 'ru')) : (banner.buttonText || t('heroBuyButton', 'uz'))}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#katalog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-2xl border border-white/20 backdrop-blur-md transition text-center"
            >
              {t('heroExploreButton', lang)}
            </a>
          </div>

          {/* Mini Trust guarantees */}
          <div className="pt-2 flex items-center gap-4 text-[11px] text-stone-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t('heroGuarantee1', lang)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t('heroGuarantee2', lang)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
