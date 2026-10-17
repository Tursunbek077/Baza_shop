import React, { useState } from 'react';
import { KeyRound, Check, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { updateAdminPassword } from '../../utils/authSecurity';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (newPassword.length < 4) {
      setError('Yangi parol kamida 4 ta belgidan iborat bo‘lishi kerak.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yangi parollar bir-biriga mos kelmadi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateAdminPassword(oldPassword, newPassword);

      if (!res.success) {
        setError(res.error || 'Parol yangilanmadi.');
        return;
      }

      setSuccess(true);
      setError('');

      setTimeout(() => {
        setSuccess(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1500);
    } catch (err) {
      setError('Xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto mb-3 text-rose-600 dark:text-rose-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900 dark:text-white">
            Maxfiy Parolni Yangilash
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Parol SHA-256 kriptografik shifrlash orqali himoyalanadi
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              Parol muvaffaqiyatli o‘zgartirildi!
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Yangi parol xavfsiz holda saqlandi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Hozirgi Parol
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Amaldagi parolni kiriting"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Yangi Parol
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Kamida 4 ta belgi"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Yangi Parolni Tasdiqlang
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Yangi parolni qayta kiriting"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-white outline-none focus:border-rose-500"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saqlanmoqda...' : 'Parolni Saqlash'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
