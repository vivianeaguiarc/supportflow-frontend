"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { AuthUser } from "../types";
import { authStore } from "./auth-store";

interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const snapshot = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );

  useEffect(() => {
    if (!authStore.getSnapshot().isHydrated) {
      authStore.hydrate();
    }
  }, []);

  const setSession = useCallback((session: AuthSession) => {
    authStore.setSession(session);
  }, []);

  const logout = useCallback(() => {
    authStore.clear();
    router.replace("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: snapshot.user,
      accessToken: snapshot.accessToken,
      isAuthenticated: Boolean(snapshot.user && snapshot.accessToken),
      isLoading: !snapshot.isHydrated,
      setSession,
      logout,
    }),
    [snapshot, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
