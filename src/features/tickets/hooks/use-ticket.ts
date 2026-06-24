import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => ticketsService.getById(id),
    enabled: Boolean(id),
  });
}
