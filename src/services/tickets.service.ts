import { httpClient } from "@/services/http-client";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import type { ListTicketsParams, Ticket, TicketSummary } from "@/types/ticket";

export const ticketsService = {
  async list(
    params: ListTicketsParams = {},
  ): Promise<ApiPaginatedResponse<Ticket>> {
    return httpClient<ApiPaginatedResponse<Ticket>>("/tickets", {
      method: "GET",
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        priority: params.priority,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    });
  },

  async getById(id: string): Promise<Ticket> {
    const response = await httpClient<ApiSuccessResponse<Ticket>>(
      `/tickets/${id}`,
      { method: "GET" },
    );

    return response.data;
  },

  async getSummary(): Promise<TicketSummary> {
    const response = await httpClient<ApiSuccessResponse<TicketSummary>>(
      "/tickets/summary",
      { method: "GET" },
    );

    return response.data;
  },
};
