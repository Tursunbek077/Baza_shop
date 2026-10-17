import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Heart, Check, Crown, Sparkles } from 'lucide-react';

export default function CustomerStorePreview({ isOpen, onClose, banner, products }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isOpen) return null;

  const heroProduct = products.find(p => p.id === banner.heroProductId) || products[0];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerPhone || cart.length === 0) return;
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-50 text-stone-900 animate-fadeIn">
      {/* Top Banner simulation bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-rose-700 via-pink-700 to-rose-800 text-white px-4 py-2 text-xs flex items-center justify-between shadow-sm">
        <span className="font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Baza_Shop Vitrinasi (Xaridor Ko‘rinishi Simulyatsiyasi)</span>
        </span>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1 px-3 py-1 bg-black/30 hover:bg-black/50 rounded-lg font-bold text-xs transition"
        >
          <X className="w-4 h-4" /> Admin panelga qaytish
        </button>
      </div>

      {/* Customer Store Navbar */}
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur-md sticky top-8 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-luxury font-extrabold tracking-widest text-xl text-stone-900">
                BAZA_SHOP
              </span>
              <p className="text-[10px] text-rose-600 uppercase tracking-widest font-semibold">
                Haute Couture • Ayollar Butigi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            >
              <ShoppingBag className="w-5 h-5 text-rose-700" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full text-xs font-bold flex items-center justify-center shadow">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner (Configured by Seller in Admin!) */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 border border-rose-900/40 p-8 sm:p-14 shadow-2xl min-h-[420px] flex flex-col justify-center">
          {/* Background image showcase */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-40 sm:opacity-90 pointer-events-none">
            {heroProduct?.image && (
              <img
                src={heroProduct.image}
                alt={heroProduct.name}
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 text-xs font-bold bg-gradient-to-r from-amber-200 to-rose-200 text-stone-950 rounded-full tracking-wider uppercase shadow">
                {banner.discountBadge || '✨ EKSKLYUZIV -25%'}
              </span>
              <span className="text-xs text-rose-300 font-semibold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                {banner.badgeText}
              </span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {banner.headline}
            </h1>

            <p className="text-sm sm:text-base text-rose-100/90 max-w-lg font-light leading-relaxed">
              {banner.subheadline}
            </p>

            {heroProduct && (
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                  {Number(heroProduct.price).toLocaleString('uz-UZ')} so‘m
                </span>
                {heroProduct.oldPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {Number(heroProduct.oldPrice).toLocaleString('uz-UZ')} so‘m
                  </span>
                )}
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => heroProduct && addToCart(heroProduct)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-xl shadow-rose-600/30 transition active:scale-95"
              >
                {banner.buttonText} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-rose-100 gap-2">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Baza_Shop Kolleksiyasi</span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Eng Nafis Ayollar Liboslari
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">{products.length} ta eksklyuziv mahsulot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white border border-rose-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-rose-200 transition duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                {product.id === banner.heroProductId && (
                  <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold bg-rose-600 text-white rounded-full uppercase tracking-wider shadow">
                    🌸 TREND
                  </span>
                )}
                {product.stockStatus === 'out_of_stock' && (
                  <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-full">
                      Tugagan
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-serif-luxury text-base font-bold text-stone-900 line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                  <div className="flex gap-1.5 mt-2">
                    {product.sizes?.map(s => (
                      <span key={s} className="px-2 py-0.5 text-[10px] font-semibold bg-stone-50 text-stone-700 rounded-md border border-stone-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-rose-50 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-stone-900 font-mono">
                      {Number(product.price).toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <button
                    disabled={product.stockStatus === 'out_of_stock'}
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-stone-300 text-white text-xs font-bold rounded-xl transition active:scale-95 shadow-md shadow-rose-600/20"
                    title="Savatga qo'shish"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Savatga
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white border-l border-rose-100 h-full flex flex-col p-6 animate-slideLeft shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif-luxury font-bold text-lg text-stone-900">Xarid Savatchasi</h3>
              </div>
              <button onClick={() => { setIsCartOpen(false); setOrderSuccess(false); }} className="p-1 text-stone-400 hover:text-stone-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="my-auto text-center p-6 bg-rose-50 border border-rose-200 rounded-3xl">
                <Check className="w-12 h-12 text-rose-600 mx-auto mb-3" />
                <h4 className="font-serif-luxury text-xl font-bold text-stone-900">Buyurtmangiz qabul qilindi!</h4>
                <p className="text-xs text-stone-600 mt-2">
                  Baza_Shop menejeri tez orada siz bilan bog‘lanadi (Admin Telegramiga xabar yo‘llandi).
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="my-auto text-center text-stone-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-40 text-rose-300" />
                <p className="text-sm">Savatchangiz bo‘sh</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-rose-600 font-mono font-bold mt-1">
                          {Number(item.price).toLocaleString('uz-UZ')} so‘m x {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCheckout} className="pt-4 border-t border-rose-100 space-y-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Jami:</span>
                    <span className="text-rose-600 font-mono">{cartTotal.toLocaleString('uz-UZ')} so‘m</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ismingiz"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-900 outline-none focus:border-rose-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Telefon raqamingiz (+998 ...)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-900 outline-none focus:border-rose-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition"
                  >
                    Buyurtmani Tasdiqlash
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
