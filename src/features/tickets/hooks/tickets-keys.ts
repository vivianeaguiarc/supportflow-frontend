import type { ListTicketsParams } from "@/types/ticket";

/**
 * Query keys centralizadas da feature de tickets.
 * Hierarquia sob `["tickets"]` permite invalidar tudo de uma vez (`all`) ou
 * partes específicas (list/detail/summary/metrics).
 */
export const ticketsKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketsKeys.all, "list"] as const,
  list: (filters: ListTicketsParams) =>
    [...ticketsKeys.all, "list", filters] as const,
  details: () => [...ticketsKeys.all, "detail"] as const,
  detail: (id: string) => [...ticketsKeys.all, "detail", id] as const,
  history: (id: string) => [...ticketsKeys.all, "history", id] as const,
  transitions: (id: string) => [...ticketsKeys.all, "transitions", id] as const,
  summary: () => [...ticketsKeys.all, "summary"] as const,
  metrics: () => [...ticketsKeys.all, "metrics"] as const,
};
