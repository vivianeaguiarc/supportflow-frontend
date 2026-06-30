import type {
  ListBreachedSlaTicketsParams,
  ListTicketsParams,
  TicketSummaryParams,
} from "@/types/ticket";

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
  summary: (params?: TicketSummaryParams) => {
    const base = [...ticketsKeys.all, "summary"] as const;
    return params ? ([...base, params] as const) : base;
  },
  metrics: () => [...ticketsKeys.all, "metrics"] as const,
  slaBreached: (params: ListBreachedSlaTicketsParams) =>
    [...ticketsKeys.all, "sla", "breached", params] as const,
  customers: () => [...ticketsKeys.all, "customers"] as const,
  categories: () => [...ticketsKeys.all, "categories"] as const,
};
