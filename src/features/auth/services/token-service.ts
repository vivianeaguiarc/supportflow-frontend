import { AUTH_STORAGE_KEYS } from "@/lib/auth/constants";
import { tokenStorage } from "@/lib/auth/token-storage";

import type { AuthUser } from "../types";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  return tokenStorage.getAccessToken();
}

export function setAccessToken(token: string): void {
  tokenStorage.setAccessToken(token);
}

export function removeAccessToken(): void {
  tokenStorage.clearAccessToken();
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
}
