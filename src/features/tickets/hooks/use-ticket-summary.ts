import { useQuery } from "@tanstack/react-query";

import type { TicketSummaryParams } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/**
 * Resumo agregado de tickets (`GET /tickets/summary`).
 * Aceita filtros (ex.: `{ customerId }`) para indicadores por cliente.
 */
export function useTicketSummary(params?: TicketSummaryParams) {
  return useQuery({
    queryKey: ticketsKeys.summary(params),
    queryFn: () => ticketsService.getSummary(params),
  });
}
