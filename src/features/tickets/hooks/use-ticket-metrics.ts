import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Métricas agregadas de tickets (`GET /tickets/metrics`). */
export function useTicketMetrics() {
  return useQuery({
    queryKey: ticketsKeys.metrics(),
    queryFn: () => ticketsService.getMetrics(),
  });
}
