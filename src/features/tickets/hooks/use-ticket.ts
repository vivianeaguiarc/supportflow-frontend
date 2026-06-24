import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Detalhe de um ticket (`GET /tickets/{id}`). */
export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketsKeys.detail(id),
    queryFn: () => ticketsService.getById(id),
    enabled: Boolean(id),
  });
}
