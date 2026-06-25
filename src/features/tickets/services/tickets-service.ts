import { httpClient } from "@/services/http-client";
import type { ApiPaginatedResponse } from "@/types/api";
import { unwrap } from "@/types/api";
import type {
  AssignTicketRequest,
  BulkAssignTicketsRequest,
  BulkTicketOperationResult,
  BulkUpdateTicketStatusRequest,
  CreateTicketRequest,
  ListTicketsParams,
  Ticket,
  TicketHistory,
  TicketMetrics,
  TicketStatusTransitions,
  TicketSummary,
  TicketSummaryParams,
  UpdateTicketStatusRequest,
} from "@/types/ticket";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function toQueryParams(filters: ListTicketsParams): QueryParams {
  const {
    page,
    limit,
    status,
    priority,
    assignedToId,
    customerId,
    search,
    sortBy,
    sortOrder,
  } = filters;

  return {
    page,
    limit,
    status,
    priority,
    assignedToId,
    customerId,
    search,
    sortBy,
    sortOrder,
  };
}

/**
 * Camada de integração com os endpoints reais de tickets.
 *
 * Todas as chamadas passam pelos route handlers BFF (`/api/tickets/*`), que
 * injetam o access token (cookie HttpOnly) como `Authorization: Bearer` ao
 * falar com o backend. Os endpoints "crus" são desembrulhados com `unwrap()`
 * por causa do envelope inconsistente do backend.
 */
export const ticketsService = {
  /** `GET /tickets` — resposta paginada (com envelope + meta). */
  list(filters: ListTicketsParams = {}): Promise<ApiPaginatedResponse<Ticket>> {
    return httpClient<ApiPaginatedResponse<Ticket>>("/api/tickets", {
      local: true,
      params: toQueryParams(filters),
    });
  },

  /** `GET /tickets/{id}` — recurso cru. */
  async getById(id: string): Promise<Ticket> {
    const response = await httpClient<Ticket>(
      `/api/tickets/${encodeURIComponent(id)}`,
      { local: true },
    );
    return unwrap<Ticket>(response);
  },

  /** `POST /tickets` — recurso cru. */
  async create(payload: CreateTicketRequest): Promise<Ticket> {
    const response = await httpClient<Ticket>("/api/tickets", {
      method: "POST",
      body: payload,
      local: true,
    });
    return unwrap<Ticket>(response);
  },

  /** `PATCH /tickets/{id}/status` — recurso cru. */
  async updateStatus(
    id: string,
    payload: UpdateTicketStatusRequest,
  ): Promise<Ticket> {
    const response = await httpClient<Ticket>(
      `/api/tickets/${encodeURIComponent(id)}/status`,
      { method: "PATCH", body: payload, local: true },
    );
    return unwrap<Ticket>(response);
  },

  /** `PATCH /tickets/{id}/assign` — recurso cru. */
  async assign(id: string, payload: AssignTicketRequest): Promise<Ticket> {
    const response = await httpClient<Ticket>(
      `/api/tickets/${encodeURIComponent(id)}/assign`,
      { method: "PATCH", body: payload, local: true },
    );
    return unwrap<Ticket>(response);
  },

  /** `PATCH /tickets/bulk/status` — alteração de status em lote (atômica). */
  async bulkUpdateStatus(
    payload: BulkUpdateTicketStatusRequest,
  ): Promise<BulkTicketOperationResult> {
    const response = await httpClient<BulkTicketOperationResult>(
      "/api/tickets/bulk/status",
      { method: "PATCH", body: payload, local: true },
    );
    return unwrap<BulkTicketOperationResult>(response);
  },

  /** `PATCH /tickets/bulk/assign` — atribuição em lote (atômica). */
  async bulkAssign(
    payload: BulkAssignTicketsRequest,
  ): Promise<BulkTicketOperationResult> {
    const response = await httpClient<BulkTicketOperationResult>(
      "/api/tickets/bulk/assign",
      { method: "PATCH", body: payload, local: true },
    );
    return unwrap<BulkTicketOperationResult>(response);
  },

  /** `GET /tickets/{id}/history` — trilha de auditoria (recurso cru). */
  async getHistory(id: string): Promise<TicketHistory> {
    const response = await httpClient<TicketHistory>(
      `/api/tickets/${encodeURIComponent(id)}/history`,
      { local: true },
    );
    return unwrap<TicketHistory>(response);
  },

  /** `GET /tickets/{id}/transitions` — transições de status válidas (recurso cru). */
  async getTransitions(id: string): Promise<TicketStatusTransitions> {
    const response = await httpClient<TicketStatusTransitions>(
      `/api/tickets/${encodeURIComponent(id)}/transitions`,
      { local: true },
    );
    return unwrap<TicketStatusTransitions>(response);
  },

  /** `GET /tickets/summary` — recurso cru (aceita filtros como `customerId`). */
  async getSummary(params: TicketSummaryParams = {}): Promise<TicketSummary> {
    const response = await httpClient<TicketSummary>("/api/tickets/summary", {
      local: true,
      params: {
        status: params.status,
        priority: params.priority,
        customerId: params.customerId,
        assignedToId: params.assignedToId,
        unassigned: params.unassigned,
        overdue: params.overdue,
        search: params.search,
      },
    });
    return unwrap<TicketSummary>(response);
  },

  /** `GET /tickets/metrics` — recurso cru. */
  async getMetrics(): Promise<TicketMetrics> {
    const response = await httpClient<TicketMetrics>("/api/tickets/metrics", {
      local: true,
    });
    return unwrap<TicketMetrics>(response);
  },
};

export type TicketsService = typeof ticketsService;
