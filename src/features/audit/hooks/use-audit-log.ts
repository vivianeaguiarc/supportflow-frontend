import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { auditService } from "../services";
import type { ListAuditLogsParams } from "../types";
import { auditKeys } from "./audit-keys";

/**
 * Lista paginada da trilha de auditoria (`GET /admin/audit-logs`).
 *
 * `keepPreviousData` mantém a página atual visível durante a navegação/filtros
 * (sem "piscar" para o estado de loading), padrão das demais tabelas server-side.
 */
export function useAuditLog(params: ListAuditLogsParams = {}) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
