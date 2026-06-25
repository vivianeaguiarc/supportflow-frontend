import { useQuery } from "@tanstack/react-query";

import { ticketLookupsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/** Lista de categorias para o select do formulário (`GET /ticket-categories`). */
export function useCategoryOptions(enabled = true) {
  return useQuery({
    queryKey: ticketsKeys.categories(),
    queryFn: () => ticketLookupsService.listCategories(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
