import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";
import type { ListTicketsParams } from "../types";

export function useTickets(params: ListTicketsParams = {}) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: () => ticketsService.list(params),
  });
}
