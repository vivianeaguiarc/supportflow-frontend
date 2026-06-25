import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Transições de status válidas de um ticket (`GET /tickets/{id}/transitions`). */
export function useTicketTransitions(ticketId: string) {
  return useQuery({
    queryKey: ticketsKeys.transitions(ticketId),
    queryFn: () => ticketsService.getTransitions(ticketId),
    enabled: Boolean(ticketId),
  });
}
