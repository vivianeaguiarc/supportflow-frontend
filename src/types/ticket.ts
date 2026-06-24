/**
 * Contratos de chamados (tickets).
 * Fonte da verdade: OpenAPI do supportflow-backend (schemas `Ticket`,
 * `TicketStatus`, `TicketPriority`, `TicketSummary`, `CreateTicketRequest`,
 * `UpdateTicketStatusRequest`, `AssignTicketRequest`).
 */

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/** Entidade `Ticket` retornada por `GET /tickets/{id}`, `POST /tickets`, etc. */
export interface Ticket {
  id: string;
  tenantId: string;
  protocol: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: string;
  categoryId: string | null;
  assignedToId: string | null;
  slaDueAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Resumo agregado de `GET /tickets/summary` (schema `TicketSummary`). */
export interface TicketSummary {
  total: number;
  open: number;
  inProgress: number;
  waitingCustomer: number;
  escalated: number;
  resolved: number;
  closed: number;
  overdue: number;
  unassigned: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
}

/** Body de `POST /tickets`. */
export interface CreateTicketRequest {
  title: string;
  description: string;
  customerId: string;
  priority?: TicketPriority;
  categoryId?: string;
  assignedToId?: string;
}

/** Body de `PATCH /tickets/{id}/status`. */
export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

/** Body de `PATCH /tickets/{id}/assign`. */
export interface AssignTicketRequest {
  agentId: string;
}

/** Query params de `GET /tickets`. */
export interface ListTicketsParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  categoryId?: string;
  customerId?: string;
  assignedTo?: string;
  assignedToId?: string;
  unassigned?: boolean;
  overdue?: boolean;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "slaDueAt" | "priority";
  sortOrder?: "asc" | "desc";
}
