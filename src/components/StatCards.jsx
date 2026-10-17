import React from 'react';
import { Package, Sparkles, CheckCircle2, DollarSign } from 'lucide-react';

export default function StatCards({ products, bannerProduct }) {
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stockStatus === 'in_stock').length;
  const averagePrice = totalProducts > 0
    ? Math.round(products.reduce((acc, p) => acc + Number(p.price || 0), 0) / totalProducts)
    : 0;

  const stats = [
    {
      label: 'Jami Liboslar',
      value: totalProducts,
      desc: 'Butikdagi barcha mahsulotlar',
      icon: Package,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40',
    },
    {
      label: 'Sotuvda Mavjud',
      value: inStockCount,
      desc: `${totalProducts - inStockCount} ta libos tugagan`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40',
    },
    {
      label: 'O‘rtacha Narx',
      value: `${averagePrice.toLocaleString('uz-UZ')} so‘m`,
      desc: 'Barcha liboslar bo‘yicha',
      icon: DollarSign,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40',
    },
    {
      label: 'Bosh Sahifa Trendi',
      value: bannerProduct ? bannerProduct.name : 'Belgilanmagan',
      desc: bannerProduct ? `${Number(bannerProduct.price).toLocaleString('uz-UZ')} so‘m` : 'Tanlang',
      icon: Sparkles,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-900/40',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 shadow-xs flex items-start gap-4 hover:border-rose-200 dark:hover:border-stone-700 transition"
          >
            <div className={`p-3 rounded-2xl border ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">{stat.label}</p>
              <h3
                className={`text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5 truncate ${
                  stat.isText ? 'text-sm font-semibold' : ''
                }`}
              >
                {stat.value}
              </h3>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate mt-0.5">{stat.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
