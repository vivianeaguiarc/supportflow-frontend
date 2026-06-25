import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Histórico/auditoria de um ticket (`GET /tickets/{id}/history`). */
export function useTicketHistory(ticketId: string) {
  return useQuery({
    queryKey: ticketsKeys.history(ticketId),
    queryFn: () => ticketsService.getHistory(ticketId),
    enabled: Boolean(ticketId),
  });
}
