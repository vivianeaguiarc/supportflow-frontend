import { useMemo } from "react";

import type { User } from "@/types/user";

import { ASSIGNABLE_ROLES } from "../types/user-types";
import { useUsers } from "./use-users";

/**
 * Limite de uma página ao carregar agentes. O endpoint aceita `role` apenas como
 * valor único, então buscamos uma página ampla e filtramos client-side pelas
 * roles atribuíveis (ADMIN/SUPERVISOR/AGENT). Para tenants muito grandes, migrar
 * para busca server-side via `search`.
 */
const AGENTS_PAGE_LIMIT = 100;

interface UseAgentsOptions {
  enabled?: boolean;
}

/** Carrega os usuários que podem ser responsáveis por tickets (agentes). */
export function useAgents(options: UseAgentsOptions = {}) {
  const query = useUsers(
    { limit: AGENTS_PAGE_LIMIT, sortBy: "name", sortOrder: "asc" },
    { enabled: options.enabled },
  );

  const agents = useMemo<User[]>(() => {
    const data = query.data?.data ?? [];
    return data.filter((user) => ASSIGNABLE_ROLES.includes(user.role));
  }, [query.data]);

  return {
    agents,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
  };
}
