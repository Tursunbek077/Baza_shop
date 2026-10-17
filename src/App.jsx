import React, { useState, useEffect, Suspense, lazy } from 'react';
import CustomerStore from './views/CustomerStore';
import { Crown } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_BANNER } from './data/initialData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './utils/storage';
import { dbService } from './services/dbService';
import { presenceService } from './services/presenceService';
import { isAdminSessionActive } from './utils/authSecurity';
import { LANG_STORAGE_KEY } from './services/i18nService';
import CinematicIntro from './components/common/CinematicIntro';

// Dynamic Code-Splitting: Lazy load AdminPanel only when authorized admin visits
const AdminPanel = lazy(() => import('./views/AdminPanel'));

export default function App() {
  // Cinematic Netflix-style intro state (plays on site visit / reload)
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Navigation view: 'store' (Customer Storefront) by default, or 'admin' (Admin Panel)
  const [currentView, setCurrentView] = useState('store');

  // Track live presence for visitors and admins
  useEffect(() => {
    presenceService.init(currentView === 'admin' ? 'admin' : 'visitor');
  }, [currentView]);

  // Theme state: false = Light Mode (Default), true = Dark Mode
  const [isDark, setIsDark] = useState(() =>
    loadFromStorage(STORAGE_KEYS.THEME, false)
  );

  // Language state: 'uz' (Default) or 'ru'
  const [lang, setLang] = useState(() =>
    loadFromStorage(LANG_STORAGE_KEY, 'uz')
  );

  useEffect(() => {
    saveToStorage(LANG_STORAGE_KEY, lang);
  }, [lang]);

  const handleToggleLang = () => {
    setLang(prev => (prev === 'uz' ? 'ru' : 'uz'));
  };

  // Load products and banner with localStorage persistence & Supabase fallback
  const [products, setProducts] = useState(() => {
    const cached = loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached.map(p => {
        const init = INITIAL_PRODUCTS.find(i => i.id === p.id);
        return {
          ...p,
          name_uz: p.name_uz || p.name || init?.name_uz || '',
          name_ru: p.name_ru || p.nameRu || init?.name_ru || '',
          description_uz: p.description_uz || p.description || init?.description_uz || '',
          description_ru: p.description_ru || p.descriptionRu || init?.description_ru || '',
        };
      });
    }
    return INITIAL_PRODUCTS;
  });

  const [banner, setBanner] = useState(() =>
    loadFromStorage(STORAGE_KEYS.BANNER, INITIAL_BANNER)
  );

  // Sync with Supabase Cloud on mount
  useEffect(() => {
    let isMounted = true;
    const syncWithCloud = async () => {
      try {
        const [cloudProducts, cloudBanner] = await Promise.all([
          dbService.fetchProducts(),
          dbService.fetchBanner(),
        ]);
        if (isMounted) {
          if (cloudProducts && cloudProducts.length > 0) {
            const enriched = cloudProducts.map(p => {
              const init = INITIAL_PRODUCTS.find(i => i.id === p.id);
              return {
                ...p,
                name_uz: p.name_uz || p.name || init?.name_uz || '',
                name_ru: p.name_ru || p.nameRu || init?.name_ru || '',
                description_uz: p.description_uz || p.description || init?.description_uz || '',
                description_ru: p.description_ru || p.descriptionRu || init?.description_ru || '',
              };
            });
            setProducts(enriched);
          }
          if (cloudBanner) {
            setBanner(cloudBanner);
          }
        }
      } catch (err) {
        console.warn('Initial cloud sync notice:', err);
      }
    };
    syncWithCloud();
    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle theme & sync with HTML class + localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.THEME, isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BANNER, banner);
  }, [banner]);

  // 1-Click Set as Banner Hero product
  const handleSetHeroProduct = async (productId) => {
    const updated = {
      ...banner,
      heroProductId: productId,
    };
    setBanner(updated);
    await dbService.saveBanner(updated);
  };

  // Add new product
  const handleAddProduct = async (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);

    // If seller ticked 'isBannerHero', set as hero product immediately
    if (newProduct.isBannerHero) {
      const updatedBanner = {
        ...banner,
        heroProductId: newProduct.id,
      };
      setBanner(updatedBanner);
      await dbService.saveBanner(updatedBanner);
    }

    await dbService.addProduct(newProduct);
  };

  // Inline Price Update
  const handleUpdatePrice = async (productId, newPrice) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    await dbService.updateProductPrice(productId, newPrice);
  };

  // Stock status toggle
  const handleToggleStock = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const currentStatus = target.stockStatus;
    const nextStatus = currentStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockStatus: nextStatus } : p))
    );

    await dbService.toggleStockStatus(productId, currentStatus);
  };

  // Toggle sale status (Aksiya)
  const handleToggleSale = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const nextStatus = !target.isSale;

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isSale: nextStatus } : p))
    );

    await dbService.toggleSaleStatus(productId, target.isSale);
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (products.length <= 1) {
      alert('Oxirgi libos o‘chirib tashlanmaydi.');
      return;
    }

    const target = products.find(p => p.id === productId);
    const confirmDelete = window.confirm(
      `"${target?.name || 'Ushbu libos'}" mahsulotini rostdan ham o‘chirmoqchimisiz?\n\nBu libos mijoz vitrinasidan va Supabase bulutli bazasidan butunlay o‘chiriladi.`
    );
    if (!confirmDelete) return;

    const filtered = products.filter(p => p.id !== productId);
    setProducts(filtered);

    // If deleted product was the hero, reassign hero to first available
    if (banner.heroProductId === productId && filtered.length > 0) {
      const updatedBanner = {
        ...banner,
        heroProductId: filtered[0].id,
      };
      setBanner(updatedBanner);
      await dbService.saveBanner(updatedBanner);
    }

    await dbService.deleteProduct(productId);
  };

  // Save banner configuration
  const handleSaveBanner = async (updatedBanner) => {
    setBanner(updatedBanner);
    await dbService.saveBanner(updatedBanner);
  };

  return (
    <>
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      {currentView === 'admin' && isAdminSessionActive() ? (
        <Suspense
          fallback={
            <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-white selection:bg-rose-500">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center mb-4 shadow-xl shadow-rose-500/30 animate-pulse">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <p className="font-serif-luxury font-bold text-lg tracking-wider text-rose-300">
                Baza_Shop Boshqaruv Markazi
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Himoyalangan panel yuklanmoqda...
              </p>
            </div>
          }
        >
          <AdminPanel
            products={products}
            banner={banner}
            isDark={isDark}
            onToggleTheme={() => setIsDark(prev => !prev)}
            onAddProduct={handleAddProduct}
            onUpdatePrice={handleUpdatePrice}
            onToggleStock={handleToggleStock}
            onToggleSale={handleToggleSale}
            onDeleteProduct={handleDeleteProduct}
            onSetHeroProduct={handleSetHeroProduct}
            onSaveBanner={handleSaveBanner}
            onNavigateToStore={() => setCurrentView('store')}
          />
        </Suspense>
      ) : (
        <CustomerStore
          products={products}
          banner={banner}
          isDark={isDark}
          onToggleTheme={() => setIsDark(prev => !prev)}
          lang={lang}
          onToggleLang={handleToggleLang}
          onNavigateToAdmin={() => setCurrentView('admin')}
          onReplayIntro={() => setShowIntro(true)}
        />
      )}
    </>
  );
}
