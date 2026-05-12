import type { AuthUser, Role } from '../types/api';

const tokenKey = 'prominno_access_token';
const userKey = 'prominno_user';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(tokenKey),
  getUser: (): AuthUser | null => {
    const rawUser = localStorage.getItem(userKey);

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
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(userKey, JSON.stringify(user));
  },
  clear: (): void => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  }
};
