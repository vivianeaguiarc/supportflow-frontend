import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { auditService } from "../services";
import type { ListAuditLogsParams } from "../types";
import { auditKeys } from "./audit-keys";

/**
 * Detalhe de um registro de auditoria (master-detail).
 *
 * ⚠️ O contrato **não expõe** `GET /admin/audit-logs/{id}`. Em vez de inventar
 * um endpoint, derivamos o registro do cache da própria listagem (mesma
 * `queryKey` de `useAuditLog`), via `select`. Assim o painel de detalhes não
 * dispara nenhuma requisição extra — reutiliza a página já carregada.
 */
export function useAuditEntry(
  id: string | null,
  params: ListAuditLogsParams = {},
) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: id !== null,
    select: (result) => result.data.find((entry) => entry.id === id) ?? null,
  });
}
