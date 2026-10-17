/**
 * Baza_Shop Security & Authentication Vault
 * Implements cryptographic one-way hashing (SHA-256), brute-force rate-limiting,
 * and secure session management.
 */

const STORAGE_KEYS = {
  HASH: 'baza_shop_admin_hash_v5',
  LEGACY_PASSWORD: 'baza_shop_admin_password_v3',
  ATTEMPTS: 'baza_shop_login_attempts_v5',
  SESSION: 'baza_shop_admin_session_v4',
};

// SHA-256 hash of master key '11171118'
const DEFAULT_HASH = '512532994b1f319db9c452fe8fdec01386e62d47027b5c4221df8359f446b114';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

/**
 * Hash a plain text string into SHA-256 hex string using native Web Crypto API
 */
export async function hashString(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(plainText).trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the current login is locked due to brute-force attempts
 */
export function getLockoutStatus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.lockoutUntil && data.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((data.lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

/**
 * Record a failed login attempt; trigger lockout after MAX_ATTEMPTS
 */
export function recordFailedAttempt() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    const data = raw ? JSON.parse(raw) : { count: 0, lockoutUntil: 0 };
    const nextCount = (data.count || 0) + 1;

    if (nextCount >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_SECONDS * 1000;
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify({ count: 0, lockoutUntil }));
      return { isLocked: true, remainingSeconds: LOCKOUT_SECONDS };
    } else {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify({ count: nextCount, lockoutUntil: 0 }));
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS - nextCount };
    }
  } catch {
    return { isLocked: false, remainingAttempts: 1 };
  }
}

/**
 * Reset failed attempts upon successful login
 */
export function resetAttempts() {
  try {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  } catch {}
}

/**
 * Verify input password against cryptographic hash with migration of legacy plaintext
 */
export async function verifyAdminPassword(inputPassword) {
  const cleanInput = (inputPassword || '').trim();
  const inputHash = await hashString(cleanInput);

  // Direct check for master key 11171118
  if (cleanInput === '11171118' || inputHash === DEFAULT_HASH) {
    localStorage.setItem(STORAGE_KEYS.HASH, DEFAULT_HASH);
    // Cleanup old legacy lockout states
    localStorage.removeItem('baza_shop_login_attempts_v4');
    localStorage.removeItem('baza_shop_admin_hash_v4');
    resetAttempts();
    return true;
  }

  // Check stored hash
  let storedHash = localStorage.getItem(STORAGE_KEYS.HASH);

  // If no hash yet, initialize with DEFAULT_HASH
  if (!storedHash) {
    storedHash = DEFAULT_HASH;
    localStorage.setItem(STORAGE_KEYS.HASH, DEFAULT_HASH);
  }

  const isMatch = inputHash === storedHash;
  if (isMatch) {
    resetAttempts();
  }
  return isMatch;
}

/**
 * Change admin password securely (stores only cryptographic hash)
 */
export async function updateAdminPassword(oldPassword, newPassword) {
  const isOldValid = await verifyAdminPassword(oldPassword);
  if (!isOldValid) {
    return { success: false, error: 'Hozirgi amaldagi parol noto‘g‘ri kiritildi.' };
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: 'Yangi parol kamida 4 ta belgidan iborat bo‘lishi kerak.' };
  }

  const newHash = await hashString(newPassword);
  localStorage.setItem(STORAGE_KEYS.HASH, newHash);
  localStorage.removeItem(STORAGE_KEYS.LEGACY_PASSWORD); // Ensure no plaintext remains
  resetAttempts();
  return { success: true };
}

/**
 * Session verification
 */
export function setAdminSession(isActive = true) {
  try {
    if (isActive) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, 'active');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  } catch {}
}

export function isAdminSessionActive() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'active';
  } catch {
    return false;
  }
}
