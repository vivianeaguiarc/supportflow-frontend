import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "@/lib/api-error";
import { MESSAGES } from "@/lib/notifications";
import type { AssignTicketRequest } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

type AssignTicketInput = { id: string } & AssignTicketRequest;

/** Atribui um ticket a um agente (`PATCH /tickets/{id}/assign`). */
export function useAssignTicket() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, agentId }: AssignTicketInput) =>
      ticketsService.assign(id, { agentId }),
    meta: { successMessage: MESSAGES.ticket.assigned },
    onSuccess: (ticket) => {
      queryClient.setQueryData(ticketsKeys.detail(ticket.id), ticket);
      queryClient.invalidateQueries({
        queryKey: ticketsKeys.detail(ticket.id),
      });
      queryClient.invalidateQueries({
        queryKey: ticketsKeys.history(ticket.id),
      });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.summary() });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.metrics() });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
