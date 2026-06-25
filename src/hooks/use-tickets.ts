/**
 * Hooks públicos de tickets (listagem e mutations).
 *
 * Implementação canônica em `src/features/tickets/hooks`.
 * - `useTickets(filters)` → lista paginada (`GET /tickets`).
 * - `ticketsKeys` → fábrica de query keys.
 * - mutations: `useCreateTicket`, `useUpdateTicketStatus`, `useAssignTicket`.
 */
export {
  ticketsKeys,
  useAssignTicket,
  useCreateTicket,
  useTickets,
  useUpdateTicketStatus,
} from "@/features/tickets/hooks";
