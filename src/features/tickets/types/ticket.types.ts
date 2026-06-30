/**
 * Tipos de tickets da feature reexportados da camada canônica de contratos
 * (`src/types/ticket.ts`), que segue o OpenAPI do backend como fonte da verdade.
 */
export type {
  AgentPerformance,
  AssignTicketRequest,
  BreachedSlaTicket,
  CreateTicketRequest,
  ListBreachedSlaTicketsParams,
  ListTicketsParams,
  Ticket,
  TicketHistory,
  TicketHistoryEntry,
  TicketHistoryEvent,
  TicketMetrics,
  TicketPriority,
  TicketStatus,
  TicketStatusTransitions,
  TicketSummary,
  UpdateTicketStatusRequest,
} from "@/types/ticket";
