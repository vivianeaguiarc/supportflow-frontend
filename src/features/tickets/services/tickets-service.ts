import type { ApiPaginatedResponse } from "@/types/api";

import type { ListTicketsParams, Ticket, TicketSummary } from "../types";

export const ticketsService = {
  async list(
    params: ListTicketsParams = {},
  ): Promise<ApiPaginatedResponse<Ticket>> {
    void params;
    throw new Error("ticketsService.list ainda não foi implementado.");
  },

  async getById(id: string): Promise<Ticket> {
    void id;
    throw new Error("ticketsService.getById ainda não foi implementado.");
  },

  async getSummary(): Promise<TicketSummary> {
    throw new Error("ticketsService.getSummary ainda não foi implementado.");
  },
};

export type TicketsService = typeof ticketsService;
