import { AUTH_STORAGE_KEYS } from "@/lib/auth/constants";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  },

  clearTokens(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
    localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  },

  hasTokens(): boolean {
    return Boolean(this.getAccessToken() && this.getRefreshToken());
  },
};
