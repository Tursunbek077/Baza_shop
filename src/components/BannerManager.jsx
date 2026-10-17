import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Check, ArrowUpRight, Heart } from 'lucide-react';

export default function BannerManager({ banner, products, onSaveBanner, onUpdateProductPrice }) {
  const [formData, setFormData] = useState(banner);
  const [savedAlert, setSavedAlert] = useState(false);
  const [tempPrice, setTempPrice] = useState('');

  // Active product selected for the hero banner
  const currentHeroProduct = products.find(p => p.id === formData.heroProductId) || products[0];

  useEffect(() => {
    setFormData(banner);
    if (currentHeroProduct) {
      setTempPrice(currentHeroProduct.price);
    }
  }, [banner, currentHeroProduct?.id]);

  const handleProductChange = (productId) => {
    const selected = products.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      heroProductId: productId,
    }));
    if (selected) {
      setTempPrice(selected.price);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveBanner(formData);

    // If seller altered product price inside banner manager, update the product too
    if (currentHeroProduct && tempPrice && Number(tempPrice) !== currentHeroProduct.price) {
      onUpdateProductPrice(currentHeroProduct.id, Number(tempPrice));
    }

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <section className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 border border-rose-200 dark:border-rose-900/50">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-900 dark:text-white tracking-tight">
              Bosh Sahifa Vitrinasi & Trend Libos Boshqaruvi
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Baza_Shop bosh sahifasidagi asosiy hashamatli banner: libosni, narxni va sarlavhani 1 daqiqada almashtiring
          </p>
        </div>

        {savedAlert && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold animate-pulse">
            <Check className="w-3.5 h-3.5" /> Bosh sahifa yangilandi!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Controls form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-4">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              🌸 Bannerdagi Asosiy Libos (Trend Mahsulot)
            </label>
            <div className="relative">
              <select
                value={formData.heroProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-500 focus:bg-white dark:focus:bg-stone-800 focus:ring-1 focus:ring-rose-500 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-100 outline-none transition"
              >
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {Number(product.price).toLocaleString('uz-UZ')} so‘m ({product.category})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
              Tanlangan libosning fotosurati va narxi bir zumda bosh sahifadagi hashamatli vitrinaga chiqadi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quick Price change for this hero garment */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                💎 Ushbu Libos Narxi (so‘m)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  placeholder="490000"
                  className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-500 focus:bg-white dark:focus:bg-stone-800 rounded-2xl px-4 py-2.5 text-sm text-stone-900 dark:text-white font-mono outline-none transition"
                />
              </div>
            </div>

            {/* Discount Badge */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                ✨ Eksklyuziv Chegirma Belgisi
              </label>
              <input
                type="text"
                value={formData.discountBadge}
                onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                placeholder="✨ EKSKLYUZIV -25%"
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-500 focus:bg-white dark:focus:bg-stone-800 rounded-2xl px-4 py-2.5 text-sm text-stone-900 dark:text-white outline-none transition"
              />
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Katta Hashamatli Sarlavha (Headline)
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="Nafislik va Go‘zallik Timsoli"
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-500 focus:bg-white dark:focus:bg-stone-800 rounded-2xl px-4 py-2.5 text-sm text-stone-900 dark:text-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Qo‘shimcha Romantik Matn (Subtitle)
            </label>
            <input
              type="text"
              value={formData.subheadline}
              onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
              placeholder="Italiya ipaklari va tabiiy matolardan tikilgan cheklangan liboslar"
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-500 focus:bg-white dark:focus:bg-stone-800 rounded-2xl px-4 py-2.5 text-sm text-stone-900 dark:text-white outline-none transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> Bannerni Saqlash & Vitrinaga Chiqarish
            </button>
          </div>
        </form>

        {/* Live Preview Box (What customers see) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-rose-950 via-stone-900 to-stone-950 border border-rose-900/40 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between text-stone-100 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-900/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              Jonli Butik Vitrinasi (Live)
            </span>
            <span className="text-[10px] bg-rose-900/40 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-800/50">
              Mijoz Ekranida
            </span>
          </div>

          {/* Banner Card Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-rose-900/30 bg-stone-900/70 p-5 min-h-[290px] flex flex-col justify-between">
            <div className="flex items-start justify-between z-10">
              <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase bg-gradient-to-r from-amber-200 to-rose-200 text-stone-950 rounded-full tracking-wider shadow">
                {formData.discountBadge || 'EKSKLYUZIV'}
              </span>
              <span className="text-[11px] text-rose-200 font-medium px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-rose-800/30 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> {formData.badgeText}
              </span>
            </div>

            {/* Garment Image Showcase */}
            <div className="absolute right-1 bottom-1 w-44 h-56 sm:w-52 sm:h-64 opacity-95 pointer-events-none">
              {currentHeroProduct?.image && (
                <img
                  src={currentHeroProduct.image}
                  alt={currentHeroProduct.name}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border border-rose-900/40"
                />
              )}
            </div>

            <div className="relative z-10 max-w-[62%] mt-6 space-y-2">
              <p className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">
                {formData.tagline}
              </p>
              <h4 className="font-serif-luxury text-lg sm:text-2xl font-bold text-white leading-tight drop-shadow-sm">
                {formData.headline}
              </h4>
              <p className="text-xs text-stone-300 line-clamp-2">
                {formData.subheadline}
              </p>

              {/* Price display */}
              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-amber-300 font-mono">
                  {Number(tempPrice || currentHeroProduct?.price || 0).toLocaleString('uz-UZ')} so‘m
                </span>
                {currentHeroProduct?.oldPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    {Number(currentHeroProduct.oldPrice).toLocaleString('uz-UZ')} so‘m
                  </span>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-xl shadow cursor-default"
                >
                  {formData.buttonText} <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 text-center mt-3">
            Tanlangan libos: <strong className="text-rose-200">{currentHeroProduct?.name}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
