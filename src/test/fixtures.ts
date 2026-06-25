import type { ApiPaginatedResponse } from "@/types/api";
import type { BulkTicketOperationResult, Ticket } from "@/types/ticket";

/** Ticket determinístico para asserções de hooks/serviços. */
export function makeTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: "ticket-1",
    tenantId: "tenant-1",
    protocol: "SF-0001",
    title: "Não consigo acessar minha conta",
    description: "Erro 500 ao tentar logar.",
    status: "OPEN",
    priority: "MEDIUM",
    customerId: "customer-1",
    categoryId: null,
    assignedToId: null,
    slaDueAt: "2025-01-02T00:00:00.000Z",
    closedAt: null,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    ...overrides,
  };
}

/** Resposta paginada (envelope do backend) para `GET /tickets`. */
export function makePaginatedTickets(
  tickets: Ticket[] = [makeTicket()],
): ApiPaginatedResponse<Ticket> {
  return {
    success: true,
    data: tickets,
    message: "ok",
    meta: {
      page: 1,
      limit: 20,
      total: tickets.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

/** Resultado atômico das operações em lote (`/tickets/bulk/*`). */
export function makeBulkResult(
  overrides: Partial<BulkTicketOperationResult> = {},
): BulkTicketOperationResult {
  return {
    totalRequested: 2,
    totalUpdated: 2,
    updatedTicketIds: ["ticket-1", "ticket-2"],
    operation: "bulk_status_update",
    message: "ok",
    ...overrides,
  };
}
