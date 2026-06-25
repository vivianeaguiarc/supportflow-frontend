import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/features/dashboard/hooks";
import { getErrorMessage } from "@/lib/api-error";
import { MESSAGES } from "@/lib/notifications";
import type { CreateTicketRequest } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/**
 * Cria um ticket (`POST /tickets`).
 *
 * Em caso de sucesso invalida tudo de tickets (lista, summary, metrics) e os
 * analytics do dashboard, mantendo os indicadores coerentes com o novo chamado.
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTicketRequest) =>
      ticketsService.create(payload),
    meta: { successMessage: MESSAGES.ticket.created },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.all });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
