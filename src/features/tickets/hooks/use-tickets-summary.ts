import { useQuery } from "@tanstack/react-query";

import { ticketsService } from "../services";

export function useTicketsSummary() {
  return useQuery({
    queryKey: ["tickets", "summary"],
    queryFn: () => ticketsService.getSummary(),
  });
}
