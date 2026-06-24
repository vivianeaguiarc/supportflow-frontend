import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "@/services/tickets.service";
import type { ListTicketsParams } from "@/types/ticket";

export function useTickets(params: ListTicketsParams = {}) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: () => ticketsService.list(params),
  });
}
