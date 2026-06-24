"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useCallback, useMemo } from "react";

import { AUTH_ME_QUERY_KEY, useMe } from "../hooks/use-me";
import { authService } from "../services";
import type { AuthState } from "../types";

const AUTH_QUERY_KEY = ["auth"] as const;

export interface AuthContextValue extends AuthState {
  /** Revalida a sessão consultando `GET /auth/me` (ex.: após login). */
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Hidratação da sessão ao carregar a aplicação (server state via React Query).
  const { data, isPending } = useMe();
  const user = data ?? null;

  const refreshSession = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      router.replace("/login");
    }
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isPending,
      refreshSession,
      logout,
    }),
    [user, isPending, refreshSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
