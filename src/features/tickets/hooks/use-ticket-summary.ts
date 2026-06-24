import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Resumo agregado de tickets (`GET /tickets/summary`). */
export function useTicketSummary() {
  return useQuery({
    queryKey: ticketsKeys.summary(),
    queryFn: () => ticketsService.getSummary(),
  });
}
