import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import {
  verifyAdminPassword,
  getLockoutStatus,
  recordFailedAttempt,
  resetAttempts,
  setAdminSession,
} from '../../utils/authSecurity';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Check lockout on open and maintain countdown
  useEffect(() => {
    if (!isOpen) return;
    const status = getLockoutStatus();
    if (status.isLocked) {
      setLockoutSeconds(status.remainingSeconds);
    } else {
      setLockoutSeconds(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const isMatch = await verifyAdminPassword(password);

      if (isMatch) {
        resetAttempts();
        setAdminSession(true);
        setError('');
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
          setPassword('');
          window.scrollTo({ top: 0, behavior: 'instant' });
          onLoginSuccess();
        }, 350);
      } else {
        const attemptResult = recordFailedAttempt();
        if (attemptResult.isLocked) {
          setLockoutSeconds(attemptResult.remainingSeconds);
          setError(`Xavfsizlik choralari: 5 marta xato urinish! Iltimos, ${attemptResult.remainingSeconds} soniya kuting.`);
        } else {
          setError(`Noto‘g‘ri parol! (Qolgan urinishlar: ${attemptResult.remainingAttempts})`);
        }
        setPassword('');
      }
    } catch (err) {
      setError('Tekshirishda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-rose-200 dark:border-stone-800 w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Top close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition ${
          isSuccess
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : isLocked
            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : isLocked ? (
            <Clock className="w-7 h-7 animate-pulse" />
          ) : (
            <Lock className="w-7 h-7" />
          )}
        </div>

        <div className="text-center mb-5">
          <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-white">
            {isSuccess ? 'Xush kelibsiz!' : isLocked ? 'Vaqtincha Bloklandi' : 'Do‘kon Egasi Ruxsati'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {isSuccess
              ? 'Ruxsat berildi, Admin panel ochilmoqda...'
              : isLocked
              ? `Xavfsizlik yuzasidan tizim ${lockoutSeconds} soniyaga qulflangan.`
              : 'Ushbu bo‘lim faqat Baza_Shop ma’murlari uchun (SHA-256 himoyalangan).'}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Admin panelga o‘tilmoqda...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked || isSubmitting}
                autoFocus={!isLocked}
                placeholder={isLocked ? `Kuting (${lockoutSeconds}s)...` : "Parolni kiriting..."}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full bg-stone-50 dark:bg-stone-800 border ${
                  isLocked
                    ? 'border-amber-300 dark:border-amber-700 opacity-60 cursor-not-allowed'
                    : 'border-stone-200 dark:border-stone-700 focus:border-rose-500'
                } focus:bg-white dark:focus:bg-stone-800 rounded-2xl pl-10 pr-10 py-3 text-sm text-stone-900 dark:text-white outline-none transition`}
              />
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            {error && (
              <div className={`flex items-center gap-1.5 p-2.5 rounded-xl text-xs font-semibold border ${
                isLocked
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
              }`}>
                {isLocked ? <Clock className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLocked || isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Tekshirilmoqda...' : isLocked ? `Bloklangan (${lockoutSeconds}s)` : 'Panelga Kirish'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
