import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCards from '../components/StatCards';
import BannerManager from '../components/BannerManager';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import CustomerStorePreview from '../components/CustomerStorePreview';
import ChangePasswordModal from '../components/admin/ChangePasswordModal';
import TelegramSettingsModal from '../components/admin/TelegramSettingsModal';
import { setAdminSession } from '../utils/authSecurity';
import { presenceService } from '../services/presenceService';
import { Lock, Store, KeyRound, Send, Users } from 'lucide-react';

export default function AdminPanel({
  products,
  banner,
  isDark,
  onToggleTheme,
  onAddProduct,
  onUpdatePrice,
  onToggleStock,
  onToggleSale,
  onDeleteProduct,
  onSetHeroProduct,
  onSaveBanner,
  onNavigateToStore,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [onlineStats, setOnlineStats] = useState(() => presenceService.stats);

  // Subscribe to real-time online presence
  useEffect(() => {
    const unsubscribe = presenceService.subscribe((stats) => {
      setOnlineStats(stats);
    });
    return () => unsubscribe();
  }, []);

  const currentHeroProduct = products.find(p => p.id === banner.heroProductId) || products[0];

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'dark bg-stone-950 text-stone-100' : 'bg-[#FAF8F5] text-stone-900'
      } flex flex-col transition-colors duration-200 selection:bg-rose-500 selection:text-white`}
    >
      {/* Top Banner Navigation Bar to go back to store or logout */}
      <div className="bg-stone-900 text-white px-4 py-2.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-stone-200">
              👑 Baza_Shop — Do‘kon Egasi Boshqaruv Markazi
            </span>
          </div>

          {/* Real-time Online Visitors Badge (Non-intrusive) */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-800/90 hover:bg-stone-800 border border-emerald-500/30 rounded-xl text-stone-300 shadow-xs transition select-none cursor-default"
            title={`Ayni paytda saytda faol bo‘lganlar: ${onlineStats.total} kishi (${onlineStats.visitors} mijoz, ${onlineStats.admins} admin)`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-medium text-stone-300">
              Onlayn: <strong className="text-emerald-400 font-bold">{onlineStats.total}</strong> kishi
            </span>
            {onlineStats.visitors > 0 && (
              <span className="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded-md font-semibold">
                {onlineStats.visitors} mijoz
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold transition border border-stone-700 shadow-xs"
            title="Telegram Bot bildirishnoma sozlamalari"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Telegram Bot</span>
          </button>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-semibold transition border border-stone-700"
            title="Maxfiy parolni yangilash"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Parolni O‘zgartirish</span>
          </button>

          <button
            onClick={onNavigateToStore}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold transition border border-stone-700"
          >
            <Store className="w-3.5 h-3.5 text-rose-400" />
            <span>Mijoz Vitrinasi</span>
          </button>

          <button
            onClick={() => {
              setAdminSession(false);
              onNavigateToStore();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
            title="Admin panelni qulflash va chiqish"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Qulflash & Chiqish</span>
          </button>
        </div>
      </div>

      {/* Top Navbar */}
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onOpenNewProduct={() => setIsFormOpen(true)}
        onTogglePreview={() => setIsPreviewOpen(true)}
        productCount={products.length}
      />

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats Overview */}
        <StatCards
          products={products}
          bannerProduct={currentHeroProduct}
        />

        {/* 1. Banner & Trend Clothes Manager */}
        <BannerManager
          banner={banner}
          products={products}
          onSaveBanner={onSaveBanner}
          onUpdateProductPrice={onUpdatePrice}
        />

        {/* 2. Clothes Inventory Table with inline price edit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                Baza_Shop Liboslar Ombori & Narxlar Boshqaruvi
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Libos narxini tez o‘zgartirish, sotuvdan olish yoki 1 bosishda bannerga chiqarish
              </p>
            </div>
          </div>

          <ProductTable
            products={products}
            currentHeroId={banner.heroProductId}
            onSetHeroProduct={onSetHeroProduct}
            onUpdatePrice={onUpdatePrice}
            onToggleStock={onToggleStock}
            onToggleSale={onToggleSale}
            onDeleteProduct={onDeleteProduct}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-100 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Baza_Shop Haute Couture Boutique © 2026</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Baza holati: Mahalliylashtirilgan & Xavfsiz (Local Vault)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddProduct={onAddProduct}
      />

      <CustomerStorePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        banner={banner}
        products={products}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <TelegramSettingsModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
}
