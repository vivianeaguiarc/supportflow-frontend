import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "@/lib/api-error";
import type { UpdateTicketStatusRequest } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

type UpdateTicketStatusInput = { id: string } & UpdateTicketStatusRequest;

/** Altera o status de um ticket (`PATCH /tickets/{id}/status`). */
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: UpdateTicketStatusInput) =>
      ticketsService.updateStatus(id, { status }),
    onSuccess: (ticket) => {
      queryClient.setQueryData(ticketsKeys.detail(ticket.id), ticket);
      queryClient.invalidateQueries({ queryKey: ticketsKeys.all });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
