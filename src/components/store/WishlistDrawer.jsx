import React, { useEffect, useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import {
  t,
  translateCategory,
  translateColor,
  getLocalizedProductName,
} from '../../services/i18nService';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist = [],
  products = [],
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
  lang = 'uz',
}) {
  const [addedItems, setAddedItems] = useState({});

  // Lock body scroll on mobile & desktop when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter products that are in the customer's wishlist
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAndFeedback = (product) => {
    onAddToCart(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleExploreClick = () => {
    onClose();
    const catalogEl = document.getElementById('katalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Backdrop overlay (tap to close) */}
      <div
        onClick={onClose}
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border-l border-rose-100 dark:border-stone-800 shadow-2xl flex flex-col h-full animate-slideLeft z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 shadow-xs">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{t('wishlistTitle', lang)}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                    {wishlistedProducts.length}
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  {lang === 'ru'
                    ? `${wishlistedProducts.length} ${t('wishlistCountSuffix', lang)}`
                    : `${wishlistedProducts.length} ${t('wishlistCountSuffix', lang)}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800 transition active:scale-95 cursor-pointer"
              title={lang === 'ru' ? 'Закрыть' : 'Yopish'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 divide-y divide-rose-50 dark:divide-stone-800/60">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-400 border border-rose-200/70 dark:border-rose-900/40 shadow-inner mb-4">
                  <Heart className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h4 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-white">
                  {t('wishlistEmptyTitle', lang)}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mt-1.5 leading-relaxed">
                  {t('wishlistEmptyDesc', lang)}
                </p>
                <button
                  onClick={handleExploreClick}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-pink-500 transition active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('exploreCatalog', lang)}</span>
                </button>
              </div>
            ) : (
              wishlistedProducts.map(product => {
                const localizedName = getLocalizedProductName(product, lang);
                const isAdded = Boolean(addedItems[product.id]);
                const isOutOfStock = product.stockStatus === 'out_of_stock';

                return (
                  <div
                    key={product.id}
                    className="pt-3.5 first:pt-0 flex gap-3.5 items-center group"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => onOpenQuickView && onOpenQuickView(product)}
                      className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-950 shrink-0 border border-rose-100 dark:border-stone-800 cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={localizedName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {product.isSale && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-bold bg-amber-400 text-stone-950 rounded uppercase shadow-xs">
                          {t('badgeSale', lang)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest truncate">
                            {translateCategory(product.category, lang)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(product.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-800 rounded-lg transition active:scale-90 cursor-pointer shrink-0"
                            title={t('removeFromWishlist', lang)}
                            aria-label={t('removeFromWishlist', lang)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4
                          onClick={() => onOpenQuickView && onOpenQuickView(product)}
                          className="font-serif-luxury text-xs sm:text-sm font-bold text-stone-900 dark:text-white line-clamp-1 hover:text-rose-600 transition cursor-pointer mt-0.5"
                        >
                          {localizedName}
                        </h4>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs sm:text-sm font-bold font-mono text-stone-900 dark:text-white">
                            {Number(product.price).toLocaleString('uz-UZ')} {t('som', lang)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[10px] text-stone-400 line-through font-mono">
                              {Number(product.oldPrice).toLocaleString('uz-UZ')} {t('som', lang)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to cart CTA */}
                      <div className="pt-2">
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAddAndFeedback(product)}
                          className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-900 hover:bg-rose-600 text-white dark:bg-stone-800 dark:hover:bg-rose-600'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>
                            {isAdded
                              ? t('addedToCartSuccess', lang)
                              : t('addToCart', lang)}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer CTA */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-rose-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30 flex gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExploreClick}
                className="flex-1 py-3 px-3 sm:px-4 rounded-2xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-200 dark:border-stone-700 hover:border-rose-400 transition active:scale-95 cursor-pointer text-center"
              >
                {t('exploreCatalog', lang)}
              </button>
              <button
                type="button"
                onClick={() => {
                  wishlistedProducts.forEach(p => onAddToCart(p));
                  onClose();
                }}
                className="flex-1 py-3 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition active:scale-95 cursor-pointer text-center inline-flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Все в корзину' : 'Barchasi savatga'}</span>
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
