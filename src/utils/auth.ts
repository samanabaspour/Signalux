import { AppUser } from '../types';

const USER_STORAGE_KEY = 'signalux_user';

/**
 * Retrieves the currently logged-in user from localStorage.
 */
export function getCurrentUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch (err) {
    console.error('Failed to retrieve current user from localStorage:', err);
    return null;
  }
}

/**
 * Saves or clears the current user in localStorage.
 */
export function setCurrentUser(user: AppUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to persist user to localStorage:', err);
  }
}

/**
 * Logs out the current user by removing the stored session.
 */
export function logoutUser(): void {
  setCurrentUser(null);
}
