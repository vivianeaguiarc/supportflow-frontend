"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useCallback, useMemo } from "react";

import { sessionService } from "../services";
import type { AuthUser } from "../types";

const SESSION_QUERY_KEY = ["auth", "session"] as const;

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => sessionService.getCurrentUser(),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const user = data ?? null;

  const setSession = useCallback(
    (nextUser: AuthUser) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, nextUser);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await sessionService.logout();
    } finally {
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      router.replace("/login");
    }
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isPending,
      setSession,
      logout,
    }),
    [user, isPending, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
