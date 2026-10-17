import React from 'react';
import { Sparkles, Truck, RefreshCw, Gem } from 'lucide-react';
import { t } from '../../services/i18nService';

export default function StoreFeatures({ lang = 'uz' }) {
  const features = [
    {
      icon: Gem,
      title: t('feat1Title', lang),
      desc: t('feat1Desc', lang),
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/30',
    },
    {
      icon: Truck,
      title: t('feat2Title', lang),
      desc: t('feat2Desc', lang),
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/30',
    },
    {
      icon: RefreshCw,
      title: t('feat3Title', lang),
      desc: t('feat3Desc', lang),
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/30',
    },
    {
      icon: Sparkles,
      title: t('feat4Title', lang),
      desc: t('feat4Desc', lang),
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/30',
    },
  ];

  return (
    <section id="afzalliklar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 shadow-xs flex items-start gap-4 hover:border-rose-200 dark:hover:border-stone-700 transition"
            >
              <div className={`p-3.5 rounded-2xl border ${feat.bg} shrink-0`}>
                <Icon className={`w-5 h-5 ${feat.color}`} />
              </div>
              <div>
                <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                  {feat.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
