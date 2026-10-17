import React, { useState } from 'react';
import { X, Plus, Sparkles, Shirt, Upload, Trash2, CheckCircle2, Check, Tag, Loader2, Languages } from 'lucide-react';
import { CATEGORIES, AVAILABLE_SIZES, BOUTIQUE_COLORS, getColorHex } from '../data/initialData';
import { compressImage } from '../utils/imageCompressor';
import { autoTranslateText, detectLanguage } from '../services/i18nService';

export default function ProductForm({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    name_uz: '',
    name_ru: '',
    category: 'Ko‘ylaklar',
    price: '',
    oldPrice: '',
    sizes: ['M', 'L'],
    colors: ['Klassik Qora', 'Pudra Pushti'],
    image: '',
    description: '',
    description_uz: '',
    description_ru: '',
    stockStatus: 'in_stock',
    isSale: false,
    isBannerHero: false,
  });

  const [customColor, setCustomColor] = useState('');
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  if (!isOpen) return null;

  // Auto-translate name and description between UZ and RU
  const handleAutoTranslate = async () => {
    const uzName = formData.name_uz || formData.name;
    const ruName = formData.name_ru;
    const uzDesc = formData.description_uz || formData.description;
    const ruDesc = formData.description_ru;

    if (!uzName && !ruName && !uzDesc && !ruDesc) {
      setErrors(prev => ({ ...prev, name: 'Avval o‘zbekcha yoki ruscha nom kiriting' }));
      return;
    }

    try {
      setIsTranslating(true);
      let newNameUz = uzName;
      let newNameRu = ruName;
      let newDescUz = uzDesc;
      let newDescRu = ruDesc;

      // Translate Name
      if (uzName && !ruName) {
        const detected = detectLanguage(uzName);
        if (detected === 'ru') {
          newNameRu = uzName;
          newNameUz = await autoTranslateText(uzName, 'ru', 'uz');
        } else {
          newNameRu = await autoTranslateText(uzName, 'uz', 'ru');
        }
      } else if (ruName && !uzName) {
        newNameUz = await autoTranslateText(ruName, 'ru', 'uz');
      } else if (uzName && ruName) {
        newNameRu = await autoTranslateText(uzName, 'uz', 'ru');
      }

      // Translate Description if present
      if (uzDesc && !ruDesc) {
        const detectedDesc = detectLanguage(uzDesc);
        if (detectedDesc === 'ru') {
          newDescRu = uzDesc;
          newDescUz = await autoTranslateText(uzDesc, 'ru', 'uz');
        } else {
          newDescRu = await autoTranslateText(uzDesc, 'uz', 'ru');
        }
      } else if (ruDesc && !uzDesc) {
        newDescUz = await autoTranslateText(ruDesc, 'ru', 'uz');
      }

      setFormData(prev => ({
        ...prev,
        name: newNameUz || prev.name,
        name_uz: newNameUz,
        name_ru: newNameRu,
        description: newDescUz || prev.description,
        description_uz: newDescUz,
        description_ru: newDescRu,
      }));
      setErrors(prev => ({ ...prev, name: null }));
    } catch (err) {
      console.warn('Auto translate notice:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const toggleColor = (colorName) => {
    setFormData(prev => {
      const exists = prev.colors?.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter(c => c !== colorName) : [...(prev.colors || []), colorName],
      };
    });
  };

  const addCustomColor = (e) => {
    if (e) e.preventDefault();
    if (!customColor.trim()) return;
    if (!formData.colors?.includes(customColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), customColor.trim()],
      }));
    }
    setCustomColor('');
  };

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Faqat rasm fayllarini yuklashingiz mumkin (JPG, PNG, WEBP)' }));
      return;
    }

    try {
      setIsCompressing(true);
      setErrors(prev => ({ ...prev, image: null }));

      // Automatically compress image down to web-optimized dimensions & weight (~100-200 KB)
      const result = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1600,
        quality: 0.82,
        maxSizeBytes: 200 * 1024,
      });

      setFormData(prev => ({ ...prev, image: result.dataUrl }));
      setCompressionInfo({
        originalSizeKB: result.originalSizeKB,
        compressedSizeKB: result.compressedSizeKB,
      });
      setErrors(prev => ({ ...prev, image: null }));
    } catch (err) {
      console.error('Image compression error:', err);
      setErrors(prev => ({ ...prev, image: 'Rasmni qayta ishlashda xatolik yuz berdi.' }));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeSelectedImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setCompressionInfo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const primaryName = (formData.name_uz || formData.name || formData.name_ru || '').trim();
    if (!primaryName) newErrors.name = 'Kiyim nomini kiriting';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'To‘g‘ri narx kiriting';
    if (formData.sizes.length === 0) newErrors.sizes = 'Kamida 1 ta razmer tanlang';
    if (!formData.colors || formData.colors.length === 0) newErrors.colors = 'Kamida 1 ta rang tanlang';
    if (!formData.image) newErrors.image = 'Iltimos, kiyim rasmini yuklang (kompyuter yoki telefondan)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Ensure both languages are filled (if one is missing, fallback or auto-translate)
    let finalNameUz = (formData.name_uz || formData.name || '').trim();
    let finalNameRu = (formData.name_ru || '').trim();

    if (!finalNameRu && finalNameUz) {
      finalNameRu = finalNameUz;
    }
    if (!finalNameUz && finalNameRu) {
      finalNameUz = finalNameRu;
    }

    const finalDescUz = (formData.description_uz || formData.description || '').trim();
    const finalDescRu = (formData.description_ru || finalDescUz).trim();

    onAddProduct({
      ...formData,
      id: `prod-${Date.now()}`,
      name: finalNameUz,
      name_uz: finalNameUz,
      name_ru: finalNameRu,
      description: finalDescUz,
      description_uz: finalDescUz,
      description_ru: finalDescRu,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      createdAt: new Date().toISOString().split('T')[0],
    });

    // Reset form
    setFormData({
      name: '',
      name_uz: '',
      name_ru: '',
      category: 'Ko‘ylaklar',
      price: '',
      oldPrice: '',
      sizes: ['M', 'L'],
      colors: ['Klassik Qora', 'Pudra Pushti'],
      image: '',
      description: '',
      description_uz: '',
      description_ru: '',
      stockStatus: 'in_stock',
      isSale: false,
      isBannerHero: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Yangi Tovar Qo‘shish</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Do‘kon vitrinasiga yangi kiyim kiritish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Direct Image Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Kiyim Rasmi * (Faqat kompyuter yoki telefondan)
            </label>

            {isCompressing ? (
              <div className="p-7 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-rose-600 animate-spin mb-2" />
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Rasm optimallashtirilmoqda...
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Xotira to‘lib qolmasligi uchun sifat saqlangan holda ixchamlantirilmoqda
                </p>
              </div>
            ) : formData.image ? (
              <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-stone-50 dark:bg-stone-900/80 p-3.5 flex items-center gap-4">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-white dark:bg-stone-950 shrink-0 border border-stone-200 dark:border-stone-700">
                  <img
                    src={formData.image}
                    alt="Tanlangan rasm"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Rasm muvaffaqiyatli optimallashtirildi</span>
                  </div>

                  {compressionInfo && (
                    <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-mono">
                      <span className="text-stone-500 line-through">{compressionInfo.originalSizeKB} KB</span>
                      <span className="text-stone-400">➔</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">{compressionInfo.compressedSizeKB} KB</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-stone-900 px-1 py-0.2 rounded">
                        -{Math.max(0, Math.round((1 - compressionInfo.compressedSizeKB / Math.max(1, compressionInfo.originalSizeKB)) * 100))}%
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Baza xotirasini tejash uchun rasm eng optimal hajmga keltirildi.
                  </p>
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-lg text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Rasmni o‘chirish / Boshqasini tanlash
                  </button>
                </div>
              </div>
            ) : (
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition group ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : errors.image
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/5'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2 transition">
                  <Upload className="w-6 h-6 group-hover:scale-110 transition" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center">
                  Rasm tanlash uchun bu yerga bosing
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-1">
                  Kompyuteringiz yoki telefoningizdan (JPG, PNG, WEBP) faylni tanlang
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            )}

            {errors.image && <p className="text-xs text-rose-500 mt-1.5">{errors.image}</p>}
          </div>

          {/* 2. Bilingual Name & Auto-Translate */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-rose-500" />
                <span>Kiyim Nomi (Ikki tilli / Двуязычный) *</span>
              </label>

              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Google Translate orqali bir tildan ikkinchi tilga avtomatik o‘girish"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Tarjima qilinmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ Avto-tarjima (UZ ⇄ RU)</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  🇺🇿 O‘zbekcha nomi *
                </span>
                <input
                  type="text"
                  placeholder="Masalan: Parij Shoyi Oqshom Libosi"
                  value={formData.name_uz || formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, name: val, name_uz: val });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full bg-white dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition ${
                    errors.name
                      ? 'border-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-rose-500'
                  }`}
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  🇷🇺 Ruscha nomi (На русском)
                </span>
                <input
                  type="text"
                  placeholder="Например: Парижское Шелковое Вечернее Платье"
                  value={formData.name_ru}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, name_ru: val });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition"
                />
              </div>
            </div>

            {/* Bilingual Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  🇺🇿 O‘zbekcha tavsif (ixtiyoriy)
                </span>
                <textarea
                  rows={2}
                  placeholder="Libos haqida qisqacha ma'lumot..."
                  value={formData.description_uz || formData.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, description: val, description_uz: val });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none transition resize-none"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  🇷🇺 Ruscha tavsif (Описание на русском)
                </span>
                <textarea
                  rows={2}
                  placeholder="Краткое описание наряда..."
                  value={formData.description_ru}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, description_ru: val });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none transition resize-none"
                />
              </div>
            </div>

            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* 3. Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Kategoriya
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none"
              >
                {CATEGORIES.filter(c => c !== 'Barchasi').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Ombor Holati
              </label>
              <select
                value={formData.stockStatus}
                onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none"
              >
                <option value="in_stock">✅ Sotuvda bor</option>
                <option value="out_of_stock">❌ Tugagan</option>
              </select>
            </div>
          </div>

          {/* 4. Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Sotuv Narxi (so‘m) *
              </label>
              <input
                type="number"
                placeholder="350000"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  if (errors.price) setErrors({ ...errors, price: null });
                }}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-mono outline-none transition ${
                  errors.price ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Eski Narxi (Chegirma uchun, ixtiyoriy)
              </label>
              <input
                type="number"
                placeholder="420000"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-mono outline-none"
              />
            </div>
          </div>

          {/* 5. Sizes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Mavjud O‘lchamlar (Razmerlar) *
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map(size => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {errors.sizes && <p className="text-xs text-rose-500 mt-1">{errors.sizes}</p>}
          </div>

          {/* 6. Colors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mavjud Ranglar (Admin tanlovi) *
              </label>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {formData.colors?.length || 0} ta rang tanlandi
              </span>
            </div>

            {/* Selected colors active chips with quick remove */}
            {formData.colors && formData.colors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                {formData.colors.map(c => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: getColorHex(c) }}
                    />
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => toggleColor(c)}
                      className="text-slate-400 hover:text-rose-500 ml-0.5 text-xs font-bold leading-none"
                      title="O‘chirish"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Boutique Color Palette */}
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Tezkor palitradan tanlang:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BOUTIQUE_COLORS.map(col => {
                  const isSelected = formData.colors?.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColor(col.name)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border shrink-0 ${
                          isSelected ? 'border-white/50' : 'border-black/15'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="pt-1">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Yoki o‘zingiz xohlagan yangi rangni yozing:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Masalan: Malina, Terracotta, Lavanda, Zumrad..."
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomColor(e);
                    }
                  }}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-sm shrink-0"
                >
                  + Qo‘shish
                </button>
              </div>
            </div>
            {errors.colors && <p className="text-xs text-rose-500 mt-1">{errors.colors}</p>}
          </div>

          {/* 7. Aksiya Checkbox */}
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-stone-900 dark:text-white">Ushbu kiyimga "AKSIYA" nishonini qo‘yish</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Mijoz vitrinasida sariq "AKSIYA" yozuvi bilan ko‘rinadi</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isSale}
              onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-white dark:bg-stone-800 border-amber-300 dark:border-stone-600 cursor-pointer"
            />
          </div>

          {/* 8. Banner Hero Checkbox */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-white">Ushbu kiyimni darhol Asosiy Bannerga chiqarish</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Bosh sahifadagi trend vitrinasida birinchi bo‘lib ko‘rinadi</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isBannerHero}
              onChange={(e) => setFormData({ ...formData, isBannerHero: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tovarni Qo‘shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
