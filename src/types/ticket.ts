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

/**
 * Item de `GET /tickets/sla/breached` (schema `BreachedSlaTicket`): um `Ticket`
 * com SLA já violado, acrescido do status fixo `BREACHED` e das horas de atraso
 * calculadas pelo backend.
 */
export interface BreachedSlaTicket extends Ticket {
  slaStatus: "BREACHED";
  hoursOverdue: number;
}

/**
 * Query params de `GET /tickets/sla/breached`. O endpoint real aceita apenas
 * paginação — não há filtros nem ordenação no contrato.
 */
export interface ListBreachedSlaTicketsParams {
  page?: number;
  limit?: number;
}

/** Performance individual de agente (item de `TicketMetrics`). */
export interface AgentPerformance {
  agentId: string;
  agentName: string;
  resolvedTickets: number;
  avgResolutionTimeHours: number;
}

/** Métricas agregadas de `GET /tickets/metrics` (schema `TicketMetrics`). */
export interface TicketMetrics {
  avgResolutionTimeHours: number;
  slaComplianceRate: number;
  resolvedTickets: number;
  overdueTickets: number;
  agentPerformance: AgentPerformance[];
}

/** Categoria de chamado (schema `TicketCategory`), de `GET /ticket-categories`. */
export interface TicketCategory {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  slaHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

/**
 * Contratos das operações em lote de tickets.
 *
 * Espelham os schemas OpenAPI reais do backend (`BulkUpdateTicketStatusRequest`,
 * `BulkAssignTicketsRequest`, `BulkTicketOperationResult`).
 *
 * NOTA: ainda **não há** um pacote SDK gerado (`packages/sdk`) integrado a este
 * frontend, nem uso de `openapi-fetch`. Mantemos estes tipos espelhados aqui —
 * como todos os demais contratos em `@/types` — em vez de duplicar de um SDK
 * inexistente. Os nomes batem com os schemas para troca futura trivial.
 * TODO(sdk): quando `@supportflow/sdk` for adicionado ao frontend, reexportar
 * estes tipos a partir dele e remover as definições manuais.
 */

/** Body de `PATCH /tickets/bulk/status` (schema `BulkUpdateTicketStatusRequest`). */
export interface BulkUpdateTicketStatusRequest {
  ticketIds: string[];
  status: TicketStatus;
  reason?: string;
}

/** Body de `PATCH /tickets/bulk/assign` (schema `BulkAssignTicketsRequest`). */
export interface BulkAssignTicketsRequest {
  ticketIds: string[];
  assignedToId: string;
  reason?: string;
}

export type BulkTicketOperation = "bulk_status_update" | "bulk_assign";

/** Resposta dos endpoints bulk (schema `BulkTicketOperationResult`). */
export interface BulkTicketOperationResult {
  totalRequested: number;
  totalUpdated: number;
  updatedTicketIds: string[];
  operation: BulkTicketOperation;
  message: string;
}

/** Filtros aceitos por `GET /tickets/summary` (subconjunto da listagem). */
export interface TicketSummaryParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  customerId?: string;
  assignedToId?: string;
  unassigned?: boolean;
  overdue?: boolean;
  search?: string;
}

/** Eventos da trilha de auditoria do chamado (schema `TicketHistoryEvent`). */
export type TicketHistoryEvent =
  | "CREATED"
  | "ASSIGNED"
  | "REASSIGNED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "CATEGORY_CHANGED"
  | "COMMENT_ADDED"
  | "ATTACHMENT_ADDED"
  | "ATTACHMENT_REMOVED"
  | "TICKET_ESCALATED"
  | "SLA_BREACHED";

/** Item do histórico (schema `TicketHistoryEntry`). */
export interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  /** Usuário que executou a ação; `null` quando originado pelo sistema. */
  actorId: string | null;
  action: TicketHistoryEvent;
  oldValue: string | null;
  newValue: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/** Resposta de `GET /tickets/{id}/history` (schema `TicketHistoryListResponse`). */
export interface TicketHistory {
  ticketId: string;
  history: TicketHistoryEntry[];
}

/** Resposta de `GET /tickets/{id}/transitions` (schema `TicketStatusTransitions`). */
export interface TicketStatusTransitions {
  currentStatus: TicketStatus;
  /** Status válidos a partir do estado atual (state machine do backend). */
  allowedTransitions: TicketStatus[];
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
