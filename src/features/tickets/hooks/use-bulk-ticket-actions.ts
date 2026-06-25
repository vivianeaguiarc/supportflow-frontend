import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/features/dashboard/hooks";
import { getErrorMessage } from "@/lib/api-error";
import type { TicketStatus } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/**
 * Resultado de uma ação em lote.
 *
 * O backend do SupportFlow **não** possui endpoints de bulk update; existem
 * apenas `PATCH /tickets/{id}/status` e `PATCH /tickets/{id}/assign` por ticket.
 * Para não inventar contrato, as ações em lote são executadas como N mutações
 * individuais via `Promise.allSettled`, o que torna o **sucesso parcial** um
 * resultado natural (ex.: transição de status inválida em alguns tickets).
 *
 * TODO(backend): expor endpoints de bulk (ex.: `PATCH /tickets/bulk/status`,
 * `PATCH /tickets/bulk/assign`) para reduzir round-trips e validar atomicidade.
 */
export interface BulkActionResult {
  total: number;
  succeeded: number;
  failed: { id: string; message: string }[];
}

async function runBulk(
  ids: string[],
  operation: (id: string) => Promise<unknown>,
): Promise<BulkActionResult> {
  const settled = await Promise.allSettled(ids.map((id) => operation(id)));

  const failed = settled.flatMap((result, index) =>
    result.status === "rejected"
      ? [{ id: ids[index], message: getErrorMessage(result.reason) }]
      : [],
  );

  return {
    total: ids.length,
    succeeded: ids.length - failed.length,
    failed,
  };
}

/**
 * Ações em lote para tickets. Cada mutação invalida listas/indicadores de
 * tickets e os analytics do dashboard ao concluir (mesmo com sucesso parcial).
 */
export function useBulkTicketActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ticketsKeys.all });
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  };

  const updateStatus = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: TicketStatus }) =>
      runBulk(ids, (id) => ticketsService.updateStatus(id, { status })),
    onSuccess: invalidate,
  });

  const assign = useMutation({
    mutationFn: ({ ids, agentId }: { ids: string[]; agentId: string }) =>
      runBulk(ids, (id) => ticketsService.assign(id, { agentId })),
    onSuccess: invalidate,
  });

  return { updateStatus, assign };
}
