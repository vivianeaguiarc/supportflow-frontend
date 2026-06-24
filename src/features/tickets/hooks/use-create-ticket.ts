import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "@/lib/api-error";
import type { CreateTicketRequest } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Cria um ticket (`POST /tickets`) e invalida as listas/indicadores. */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTicketRequest) =>
      ticketsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.all });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
