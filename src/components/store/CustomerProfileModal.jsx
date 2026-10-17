import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Package, X, Clock, CheckCircle2, Truck, AlertCircle, Ban, LogOut, Edit3, Check, Loader2, ShoppingBag } from 'lucide-react';
import { customerAuthService } from '../../services/customerAuthService';
import { t, translateColor, getLocalizedProductName } from '../../services/i18nService';

export default function CustomerProfileModal({
  isOpen,
  onClose,
  customer,
  onLogout,
  onUpdateCustomer,
  lang = 'uz',
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState(customer?.firstName || '');
  const [editLastName, setEditLastName] = useState(customer?.lastName || '');
  const [editAddress, setEditAddress] = useState(customer?.address || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (customer) {
      setEditFirstName(customer.firstName || '');
      setEditLastName(customer.lastName || '');
      setEditAddress(customer.address || '');
    }
  }, [customer]);

  // Load customer orders
  const loadOrders = async () => {
    if (!customer?.phone) return;
    try {
      setIsLoadingOrders(true);
      const res = await customerAuthService.getCustomerOrders(customer.phone);
      setOrders(res || []);
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isOpen && customer) {
      loadOrders();
    }
  }, [isOpen, customer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const confirmMsg =
      lang === 'ru'
        ? `Вы действительно хотите отменить заказ #${orderId}?`
        : `Haqiqatan ham #${orderId} raqamli buyurtmani bekor qilmoqchimisiz?`;
    const isConfirmed = window.confirm(confirmMsg);
    if (!isConfirmed) return;

    try {
      setCancelingOrderId(orderId);
      const targetOrder = orders.find(o => String(o.id) === String(orderId));
      await customerAuthService.cancelOrder(
        orderId,
        `${customer.firstName} ${customer.lastName || ''}`.trim(),
        customer.phone,
        targetOrder
      );

      // Refresh orders list
      await loadOrders();
    } catch (err) {
      alert(lang === 'ru' ? 'Ошибка при отмене заказа.' : 'Buyurtmani bekor qilishda xatolik yuz berdi.');
    } finally {
      setCancelingOrderId(null);
    }
  };

  // Handle profile update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await customerAuthService.updateProfile({
        firstName: editFirstName,
        lastName: editLastName,
        address: editAddress,
      });
      if (onUpdateCustomer) onUpdateCustomer(updated);
      setProfileSuccess(true);
      setIsEditing(false);
      setTimeout(() => setProfileSuccess(false), 2000);
    } catch (err) {
      alert(err.message || (lang === 'ru' ? 'Не удалось обновить профиль.' : 'Profilni yangilab bo‘lmadi.'));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'yetkazilmoqda':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Truck className="w-3 h-3 text-sky-500" /> {lang === 'ru' ? 'В пути' : 'Yetkazilmoqda'}
          </span>
        );
      case 'yakunlandi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {lang === 'ru' ? 'Доставлен' : 'Yetkazib berildi'}
          </span>
        );
      case 'bekor_qilindi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <Ban className="w-3 h-3 text-rose-500" /> {lang === 'ru' ? 'Отменен' : 'Bekor qilingan'}
          </span>
        );
      case 'yangi':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-500" /> {lang === 'ru' ? 'Новый (На рассмотрении)' : 'Yangi (Ko‘rilmoqda)'}
          </span>
        );
    }
  };

  const initials = `${customer.firstName?.[0] || 'X'}${customer.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Customer Profile Header Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-5 border-b border-rose-100 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white font-serif-luxury font-bold text-lg flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                {customer.firstName} {customer.lastName || ''}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Phone className="w-3 h-3 text-rose-500" />
                <span>{customer.phone}</span>
              </p>
              {customer.address && (
                <p className="text-[11px] text-stone-400 truncate max-w-xs mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{customer.address}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              customerAuthService.logout();
              if (onLogout) onLogout();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-500 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 dark:bg-stone-800 dark:hover:bg-stone-700 transition cursor-pointer"
            title={t('logout', lang)}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout', lang)}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 pt-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-rose-50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t('myOrders', lang)} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-rose-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Личные Данные' : 'Shaxsiy Ma’lumotlar'}</span>
          </button>
        </div>

        {/* Tab 1: ORDERS LIST */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 py-3 space-y-3">
            {isLoadingOrders ? (
              <div className="py-16 text-center text-stone-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-rose-500" />
                <p className="text-xs">{lang === 'ru' ? 'Загрузка ваших заказов...' : 'Buyurtmalaringiz yuklanmoqda...'}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30 text-rose-400" />
                <p className="font-serif-luxury text-base font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'ru' ? 'Вы еще не сделали ни одного заказа' : 'Hozircha hech qanday buyurtma bermagansiz'}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {lang === 'ru' ? 'Выберите изысканные наряды из каталога' : 'Kolleksiyadagi liboslarni tanlab buyurtma bering'}
                </p>
              </div>
            ) : (
              orders.map((ord) => {
                const canCancel = !ord.status || ord.status === 'yangi';
                const isCanceling = cancelingOrderId === ord.id;
                const localeCode = lang === 'ru' ? 'ru-RU' : 'uz-UZ';
                const formattedDate = ord.createdAt
                  ? new Date(ord.createdAt).toLocaleDateString(localeCode, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-3"
                  >
                    {/* Top Row: ID, Date, Status Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-stone-200/60 dark:border-stone-700">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                          #{ord.id}
                        </span>
                        {formattedDate && (
                          <span className="text-[11px] text-stone-400">
                            • {formattedDate}
                          </span>
                        )}
                      </div>
                      <div>{getStatusBadge(ord.status)}</div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-1.5">
                      {ord.items?.map((item, idx) => {
                        const localizedItemName = getLocalizedProductName(item, lang);
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                            <span className="font-medium truncate max-w-[240px] sm:max-w-sm">
                              {localizedItemName} ({item.selectedSize} • {translateColor(item.selectedColor, lang)})
                            </span>
                            <span className="font-mono font-bold text-stone-900 dark:text-white shrink-0">
                              × {item.qty} {lang === 'ru' ? 'шт' : 'dona'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Row: Total Amount & Cancel CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-200/80 dark:border-stone-700">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          {lang === 'ru' ? 'Итого к Оплате:' : 'Jami To‘lov:'}
                        </span>
                        <span className="font-mono font-bold text-sm sm:text-base text-rose-600 dark:text-rose-400">
                          {Number(ord.totalAmount).toLocaleString('uz-UZ')} {t('som', lang)}
                        </span>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(ord.id)}
                          disabled={isCanceling}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                          title={lang === 'ru' ? 'Отменить заказ' : 'Buyurtmani bekor qilish'}
                        >
                          {isCanceling ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                          <span>{lang === 'ru' ? 'Отменить' : 'Bekor Qilish'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: PROFILE EDIT */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 -mr-1">
            {profileSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Личные данные успешно сохранены!' : 'Shaxsiy ma’lumotlaringiz muvaffaqiyatli saqlandi!'}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ru' ? 'Ваше Имя' : 'Ismingiz'}
                </label>
                <input
                  type="text"
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ru' ? 'Фамилия' : 'Familiyangiz'}
                </label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Номер Телефона (Неизменяемый)' : 'Telefon Raqamingiz (O‘zgarmas)'}
              </label>
              <input
                type="text"
                disabled
                value={customer.phone}
                className="w-full bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-500 dark:text-stone-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ru' ? 'Постоянный Адрес Доставки' : 'Doimiy Yetkazish Manzili'}
              </label>
              <input
                type="text"
                placeholder={
                  lang === 'ru'
                    ? 'г. Ташкент, ул. Навои, дом 10...'
                    : 'Shahar, tuman, ko‘cha, xonadon...'
                }
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/25 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Сохранить изменения' : 'O‘zgarishlarni Saqlash'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
