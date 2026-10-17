import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { CATEGORIES, getColorHex } from '../../data/initialData';
import {
  t,
  translateCategory,
  translateColor,
  getLocalizedProductName,
  getLocalizedProductDescription,
} from '../../services/i18nService';

export default function StoreProducts({
  products,
  heroProductId,
  onAddToCart,
  onOpenQuickView,
  onQuickBuy,
  wishlist,
  onToggleWishlist,
  lang = 'uz',
}) {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedColors, setSelectedColors] = useState({});

  // Filter products by category
  let filtered = products.filter(product => {
    return selectedCategory === 'Barchasi' || product.category === selectedCategory;
  });

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Section Header */}
      <div className="mb-8 pb-4 border-b border-rose-100 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {lang === 'ru' ? 'Эксклюзивный Каталог Бутика' : 'Eksklyuziv Butik Katalogi'}
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-900 dark:text-white mt-1">
            {t('catalogTitle', lang)}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {lang === 'ru'
              ? 'Наряды, подобранные с безупречным вкусом для торжественных вечеров и выходов в свет'
              : 'Har bir xonadon va tantanali oqshomlar uchun betakror did bilan tanlangan liboslar'}
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-2xl whitespace-nowrap transition shrink-0 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-rose-50/80 text-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {translateCategory(category, lang)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-stone-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-stone-400" />
          {t('noProductsFound', lang)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {filtered.map(product => {
            const isHero = product.id === heroProductId;
            const isWishlisted = wishlist.includes(product.id);
            const isOutOfStock = product.stockStatus === 'out_of_stock';
            const currentColor = selectedColors[product.id] || product.colors?.[0] || 'Klassik Qora';
            const localizedName = getLocalizedProductName(product, lang);
            const localizedDesc =
              getLocalizedProductDescription(product, lang) ||
              (lang === 'ru'
                ? '100% натуральная ткань, эксклюзивный пошив высшего качества.'
                : '100% tabiiy matodan tikilgan yuqori sifatli ayollar libosi.');

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-rose-200 dark:hover:border-stone-700 transition duration-300 flex flex-col justify-between group"
              >
                {/* Image Container with Badges and Overlay Actions */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-stone-950">
                  <img
                    src={product.image}
                    alt={localizedName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                    {isHero && (
                      <span className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full uppercase tracking-wider shadow">
                        {t('badgeTrending', lang)}
                      </span>
                    )}
                    {product.isSale && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-400 text-stone-950 rounded-full uppercase shadow">
                        {t('badgeSale', lang)}
                      </span>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-3.5 right-3.5 p-2.5 sm:p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:bg-white dark:hover:bg-stone-800 shadow-md transition-all duration-200 z-30 cursor-pointer active:scale-125"
                    title={lang === 'ru' ? (isWishlisted ? 'Удалить из избранного' : 'В избранное') : (isWishlisted ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga saqlash')}
                    aria-label={lang === 'ru' ? 'В избранное' : 'Sevimlilarga saqlash'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-200 ${
                        isWishlisted
                          ? 'fill-rose-500 text-rose-500 scale-110'
                          : 'text-stone-700 dark:text-stone-300 group-hover:scale-105'
                      }`}
                    />
                  </button>

                  {/* Quick View Floating Button on Hover */}
                  <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={() => onOpenQuickView({ ...product, selectedColor: currentColor })}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/95 text-stone-950 text-xs font-bold rounded-2xl shadow-lg hover:bg-rose-50 transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-rose-600" />
                      <span>{t('quickView', lang)}</span>
                    </button>
                  </div>

                  {/* Out of stock overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center z-20">
                      <span className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-full shadow">
                        {t('badgeOutOfStock', lang)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                        {translateCategory(product.category, lang)}
                      </span>
                      <div className="flex gap-1">
                        {product.sizes?.map(s => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 text-[9px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3
                      onClick={() => onOpenQuickView({ ...product, selectedColor: currentColor })}
                      className="font-serif-luxury text-base sm:text-lg font-bold text-stone-900 dark:text-white line-clamp-1 mt-1 hover:text-rose-600 transition cursor-pointer"
                    >
                      {localizedName}
                    </h3>

                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                      {localizedDesc}
                    </p>

                    {/* Interactive Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                          {t('selectColor', lang)}{' '}
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {translateColor(currentColor, lang)}
                          </span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {product.colors.map(col => {
                            const hex = getColorHex(col);
                            const isSelected = currentColor === col;
                            return (
                              <button
                                key={col}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedColors(prev => ({ ...prev, [product.id]: col }));
                                }}
                                title={translateColor(col, lang)}
                                className={`w-5 h-5 rounded-full border border-black/15 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'ring-2 ring-rose-500 ring-offset-2 scale-110 shadow-xs'
                                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                                style={{ backgroundColor: hex }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Action CTA */}
                  <div className="pt-3 border-t border-rose-50 dark:border-stone-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-stone-900 dark:text-white font-mono">
                        {Number(product.price).toLocaleString('uz-UZ')} {t('som', lang)}
                      </div>
                      {product.oldPrice && (
                        <div className="text-[11px] text-stone-400 line-through font-mono">
                          {Number(product.oldPrice).toLocaleString('uz-UZ')} {t('som', lang)}
                        </div>
                      )}
                    </div>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => onAddToCart({ ...product, selectedColor: currentColor })}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition active:scale-95 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:shadow-none cursor-pointer"
                      title={t('addToCart', lang)}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('addToCart', lang)}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
