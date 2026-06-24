import { useQuery } from "@tanstack/react-query";

import { authService } from "../services";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

/**
 * Server state da sessão: consome `GET /auth/me` via React Query.
 * É a fonte única do usuário autenticado no frontend.
 */
export function useMe() {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
