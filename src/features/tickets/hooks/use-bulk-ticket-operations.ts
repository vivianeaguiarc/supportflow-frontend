import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/features/dashboard/hooks";
import { getErrorMessage } from "@/lib/api-error";
import type {
  BulkAssignTicketsRequest,
  BulkTicketOperationResult,
  BulkUpdateTicketStatusRequest,
} from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/**
 * Invalidação compartilhada após uma operação em lote bem-sucedida.
 * Usa `updatedTicketIds` da resposta para invalidar os detalhes exatos dos
 * tickets afetados (sem optimistic update — recarregamos do servidor).
 */
function useBulkInvalidation() {
  const queryClient = useQueryClient();

  return (result: BulkTicketOperationResult) => {
    void queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
    void queryClient.invalidateQueries({ queryKey: ticketsKeys.summary() });
    void queryClient.invalidateQueries({ queryKey: ticketsKeys.metrics() });
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });

    for (const id of result.updatedTicketIds) {
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.history(id) });
      void queryClient.invalidateQueries({
        queryKey: ticketsKeys.transitions(id),
      });
    }
  };
}

/** `PATCH /tickets/bulk/status` — alteração de status em lote (atômica e tipada). */
export function useBulkUpdateTicketStatus() {
  const invalidate = useBulkInvalidation();

  const mutation = useMutation({
    mutationFn: (payload: BulkUpdateTicketStatusRequest) =>
      ticketsService.bulkUpdateStatus(payload),
    onSuccess: invalidate,
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}

/** `PATCH /tickets/bulk/assign` — atribuição de responsável em lote (atômica e tipada). */
export function useBulkAssignTickets() {
  const invalidate = useBulkInvalidation();

  const mutation = useMutation({
    mutationFn: (payload: BulkAssignTicketsRequest) =>
      ticketsService.bulkAssign(payload),
    onSuccess: invalidate,
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
