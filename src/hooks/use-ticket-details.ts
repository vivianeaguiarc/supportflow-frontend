/**
 * Hook público de detalhe de um ticket (`GET /tickets/{id}`).
 *
 * Implementação canônica: `useTicket` em `src/features/tickets/hooks`.
 * Exportado também como `useTicketDetails` (nome citado na documentação).
 */
export {
  useTicket,
  useTicket as useTicketDetails,
} from "@/features/tickets/hooks";
