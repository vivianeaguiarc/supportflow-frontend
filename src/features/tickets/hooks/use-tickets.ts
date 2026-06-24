import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ListTicketsParams } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Lista paginada de tickets (`GET /tickets`) com filtros do backend. */
export function useTickets(filters: ListTicketsParams = {}) {
  return useQuery({
    queryKey: ticketsKeys.list(filters),
    queryFn: () => ticketsService.list(filters),
    placeholderData: keepPreviousData,
  });
}
