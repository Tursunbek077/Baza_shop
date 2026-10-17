import React, { useState } from 'react';
import { Search, Star, Trash2, Check, Edit2, AlertCircle, Tag } from 'lucide-react';
import { CATEGORIES, getColorHex } from '../data/initialData';

export default function ProductTable({
  products,
  currentHeroId,
  onSetHeroProduct,
  onUpdatePrice,
  onToggleStock,
  onToggleSale,
  onDeleteProduct,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');

  // Filter products by category and query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Barchasi' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const startEditPrice = (product) => {
    setEditingId(product.id);
    setEditingPrice(product.price);
  };

  const saveEditPrice = (productId) => {
    if (editingPrice && Number(editingPrice) > 0) {
      onUpdatePrice(productId, Number(editingPrice));
    }
    setEditingId(null);
  };

  return (
    <section className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 rounded-3xl shadow-xs overflow-hidden transition">
      {/* Table Toolbar / Filters */}
      <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Libos nomi bo‘yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-500 focus:bg-white dark:focus:bg-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-white outline-none transition"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition shrink-0 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-rose-50 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Mobile Phone Touch Card View (Shown on screens < 768px) */}
      <div className="block md:hidden divide-y divide-rose-100/70 dark:divide-stone-800">
        {filteredProducts.length === 0 ? (
          <div className="py-10 text-center text-stone-400">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-stone-400" />
            Hech qanday libos topilmadi.
          </div>
        ) : (
          filteredProducts.map(product => {
            const isHero = product.id === currentHeroId;
            const isEditing = editingId === product.id;

            return (
              <div
                key={product.id}
                className={`p-4 space-y-3 transition ${isHero ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-950 shrink-0 border border-stone-200 dark:border-stone-800">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-stone-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h4>
                      {isHero && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 shrink-0">
                          🌸 BANNERDA
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                        {product.category}
                      </span>
                      <div className="flex gap-1">
                        {product.sizes?.map(sz => (
                          <span key={sz} className="text-[10px] text-stone-500 font-bold">
                            {sz}
                          </span>
                        ))}
                      </div>
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1 pl-1">
                          {product.colors.map(col => (
                            <span
                              key={col}
                              title={col}
                              className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0 inline-block"
                              style={{ backgroundColor: getColorHex(col) }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price edit on mobile */}
                    <div className="mt-2 flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditPrice(product.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-28 bg-white dark:bg-stone-950 border border-rose-500 rounded-lg px-2 py-1 text-xs text-stone-900 dark:text-white font-mono outline-none"
                          />
                          <button
                            onClick={() => saveEditPrice(product.id)}
                            className="p-1 bg-emerald-600 text-white rounded-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditPrice(product)}
                          className="flex items-center gap-1 cursor-pointer bg-stone-50 dark:bg-stone-800/80 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700"
                        >
                          <span className="text-xs font-bold text-stone-900 dark:text-white font-mono">
                            {Number(product.price).toLocaleString('uz-UZ')} so‘m
                          </span>
                          <Edit2 className="w-3 h-3 text-rose-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile action buttons toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    {/* Stock toggle */}
                    <button
                      onClick={() => onToggleStock(product.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        product.stockStatus === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {product.stockStatus === 'in_stock' ? '✅ Mavjud' : '❌ Tugagan'}
                    </button>

                    {/* Aksiya button on mobile */}
                    <button
                      onClick={() => onToggleSale(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                        product.isSale
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:text-amber-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                      title={product.isSale ? 'Aksiyani bekor qilish' : 'Aksiya belgisini yoqish'}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{product.isSale ? '🔥 Aksiya' : '+ Aksiya'}</span>
                    </button>

                    {/* Banner Hero button */}
                    <button
                      onClick={() => onSetHeroProduct(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                        isHero
                          ? 'bg-rose-600 text-white'
                          : 'bg-stone-100 text-stone-700 hover:text-rose-600 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${isHero ? 'fill-white' : ''}`} />
                      {isHero ? 'Bannerda' : 'Bannerga'}
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop High-Density Table (Shown on screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-stone-50/70 dark:bg-stone-950/60 text-stone-600 dark:text-stone-400 uppercase tracking-wider text-[11px] font-semibold border-b border-rose-100 dark:border-stone-800">
            <tr>
              <th className="py-3 px-4">Libos & Kategoriya</th>
              <th className="py-3 px-4">Narxi (Tezkor tahrirlash)</th>
              <th className="py-3 px-4">O‘lchamlar</th>
              <th className="py-3 px-4 text-center">Aksiya Holati</th>
              <th className="py-3 px-4">Ombor Holati</th>
              <th className="py-3 px-4 text-center">Baza_Shop Banneri</th>
              <th className="py-3 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100/70 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-stone-400">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-stone-400 dark:text-stone-500" />
                  Hech qanday libos topilmadi.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const isHero = product.id === currentHeroId;
                const isEditing = editingId === product.id;

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-rose-50/40 dark:hover:bg-stone-800/40 transition-colors ${
                      isHero ? 'bg-rose-50/30 dark:bg-rose-950/15' : ''
                    }`}
                  >
                    {/* Item Image and Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-15 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 shrink-0 border border-stone-200 dark:border-stone-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                              {product.name}
                            </span>
                            {isHero && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0">
                                🌸 ASOSIY BANNERDA
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                              {product.category}
                            </span>
                            {product.colors && product.colors.length > 0 && (
                              <div className="flex items-center gap-1">
                                {product.colors.map(col => (
                                  <span
                                    key={col}
                                    title={col}
                                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0 inline-block"
                                    style={{ backgroundColor: getColorHex(col) }}
                                  />
                                ))}
                              </div>
                            )}
                            <span className="text-[11px] text-stone-400 dark:text-stone-500">ID: {product.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditPrice(product.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-32 bg-white dark:bg-stone-950 border border-rose-500 rounded-xl px-2.5 py-1 text-xs text-stone-900 dark:text-white font-mono outline-none shadow-sm"
                          />
                          <button
                            onClick={() => saveEditPrice(product.id)}
                            className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow"
                            title="Saqlash"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditPrice(product)}
                          className="group cursor-pointer inline-flex items-center gap-1.5 px-2 py-1 -mx-2 rounded-lg hover:bg-rose-50 dark:hover:bg-stone-800 transition"
                          title="Narxni o'zgartirish uchun bosing"
                        >
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                            {Number(product.price).toLocaleString('uz-UZ')} so‘m
                          </span>
                          <Edit2 className="w-3 h-3 text-stone-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition" />
                        </div>
                      )}
                      {product.oldPrice && (
                        <div className="text-[11px] text-stone-400 line-through font-mono">
                          {Number(product.oldPrice).toLocaleString('uz-UZ')} so‘m
                        </div>
                      )}
                    </td>

                    {/* Sizes */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes?.map(sz => (
                          <span
                            key={sz}
                            className="px-2 py-0.5 text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-md"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Aksiya Toggle in Desktop */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleSale(product.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                          product.isSale
                            ? 'bg-amber-400 text-stone-950 shadow-xs shadow-amber-400/30'
                            : 'bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:text-amber-300 border border-stone-200 dark:border-stone-700'
                        }`}
                        title={product.isSale ? 'Aksiya belgisini olib tashlash' : 'Ushbu kiyimga Aksiya belgisini qo‘yish'}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{product.isSale ? '🔥 Aksiya faol' : '+ Aksiya qo‘yish'}</span>
                      </button>
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleStock(product.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                          product.stockStatus === 'in_stock'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'in_stock' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {product.stockStatus === 'in_stock' ? 'Sotuvda bor' : 'Tugagan'}
                      </button>
                    </td>

                    {/* Quick Banner Hero Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSetHeroProduct(product.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isHero
                            ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30 cursor-default'
                            : 'bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:text-rose-300 dark:border-stone-700'
                        }`}
                        title={isHero ? 'Bu libos hozir bosh sahifa bannerida turibdi' : 'Bu libosni bosh sahifa banneriga chiqarish'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isHero ? 'fill-white' : ''}`} />
                        {isHero ? 'Bannerda faol' : 'Bannerga qo‘yish'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-rose-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>Ko‘rsatilmoqda: {filteredProducts.length} ta eksklyuziv libos</span>
        <span className="italic">💡 Maslahat: Narxni tezda o‘zgartirish uchun uning ustiga bosing</span>
      </div>
    </section>
  );
}
