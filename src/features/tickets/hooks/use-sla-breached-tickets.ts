import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ListBreachedSlaTicketsParams } from "@/types/ticket";

import { ticketsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/**
 * Lista paginada de chamados com SLA violado (`GET /tickets/sla/breached`).
 * O contrato real aceita somente paginação (`page`/`limit`).
 */
export function useSlaBreachedTickets(
  params: ListBreachedSlaTicketsParams = {},
) {
  return useQuery({
    queryKey: ticketsKeys.slaBreached(params),
    queryFn: () => ticketsService.listBreachedSla(params),
    placeholderData: keepPreviousData,
  });
}
