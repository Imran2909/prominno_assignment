import type { AuthUser, Role } from '../types/api';

const tokenKey = 'prominno_access_token';
const userKey = 'prominno_user';

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(tokenKey);
    } catch {
      return null;
    }
  },
  getUser: (): AuthUser | null => {
    let rawUser: string | null;

    try {
      rawUser = localStorage.getItem(userKey);
    } catch {
      return null;
    }

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      authStorage.clear();
      return null;
    }
  },
  getRole: (): Role | null => authStorage.getUser()?.role ?? null,
  setSession: (token: string, user: AuthUser): void => {
    try {
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(user));
    } catch {
      throw new Error('Unable to save login session in this browser');
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    } catch {
      // Storage may be blocked by the browser; nothing else is needed here.
    }
  }
};
