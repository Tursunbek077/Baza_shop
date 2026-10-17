import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Check, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { getColorHex } from '../../data/initialData';
import {
  t,
  translateCategory,
  translateColor,
  getLocalizedProductName,
  getLocalizedProductDescription,
} from '../../services/i18nService';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onQuickBuy,
  isWishlisted,
  onToggleWishlist,
  lang = 'uz',
}) {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Klassik Qora');
  const [qty, setQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const localizedName = getLocalizedProductName(product, lang);
  const localizedDesc =
    getLocalizedProductDescription(product, lang) ||
    (lang === 'ru'
      ? 'Изысканное женское платье из итальянского шелка и тканей высшего качества, созданное лимитированным тиражом.'
      : 'Italiya ipaklari va eng yuqori sifatli matolardan cheklangan miqdorda tikilgan eksklyuziv ayollar libosi.');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0] || 'Klassik Qora');
      setQty(1);
    }
  }, [product?.id]);

  const handleAdd = () => {
    onAddToCart({ ...product, selectedSize, selectedColor }, qty);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[94vh] sm:max-h-[92vh]">
        {/* Left: High-resolution Image with responsive height */}
        <div className="relative md:w-1/2 h-56 sm:h-72 md:h-auto shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-950">
          <img
            src={product.image}
            alt={localizedName}
            className="w-full h-full object-cover object-center"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="absolute top-3 left-3 p-2.5 sm:p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-300 hover:text-rose-600 shadow-md cursor-pointer transition-all active:scale-125 z-30"
            title={lang === 'ru' ? (isWishlisted ? 'Удалить из избранного' : 'В избранное') : (isWishlisted ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga saqlash')}
            aria-label={lang === 'ru' ? 'В избранное' : 'Sevimlilarga saqlash'}
          >
            <Heart className={`w-4 h-4 transition-all duration-200 ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
          </button>

          {/* Quick thumb close button on mobile */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition shadow cursor-pointer"
            title={lang === 'ru' ? 'Закрыть' : 'Yopish'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Details & Action */}
        <div className="p-5 sm:p-8 md:w-1/2 flex flex-col justify-between overflow-y-auto space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                {translateCategory(product.category, lang)}
              </span>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-1">
                {localizedName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg transition cursor-pointer"
              title={lang === 'ru' ? 'Закрыть' : 'Yopish'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white font-mono">
              {Number(product.price).toLocaleString('uz-UZ')} {t('som', lang)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-stone-400 line-through font-mono">
                {Number(product.oldPrice).toLocaleString('uz-UZ')} {t('som', lang)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {localizedDesc}
          </p>

          {/* Colors Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  {t('selectColor', lang)}
                </label>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {translateColor(selectedColor, lang)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => {
                  const hex = getColorHex(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{translateColor(color, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              {t('selectSize', lang)}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    selectedSize === size
                      ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-rose-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase">
              {t('quantity', lang)}
            </span>
            <div className="inline-flex items-center border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm font-bold cursor-pointer"
              >
                -
              </button>
              <span className="px-3 text-xs font-mono font-bold text-stone-900 dark:text-white">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAdd}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition active:scale-95 cursor-pointer"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> {t('addedToCartSuccess', lang)}
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> {t('addToCart', lang)}
                </>
              )}
            </button>

            <button
              onClick={() => {
                onQuickBuy({ ...product, selectedSize, selectedColor }, qty);
                onClose();
              }}
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-semibold text-xs rounded-2xl transition cursor-pointer"
            >
              {t('orderNow', lang)}
            </button>
          </div>

          {/* Guarantees */}
          <div className="pt-2 border-t border-rose-50 dark:border-stone-800 grid grid-cols-2 gap-2 text-[10px] text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-rose-500" /> {lang === 'ru' ? 'Бесплатная доставка' : 'Bepul yetkazish'}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {lang === 'ru' ? '100% Гарантия размера' : '100% O‘lcham kafolati'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
