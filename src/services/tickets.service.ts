/**
 * Camada pública de service de tickets.
 *
 * A implementação canônica vive em `src/features/tickets/services`. Este módulo
 * é o ponto de entrada estável citado na documentação de integração
 * (`src/services/tickets.service.ts`).
 *
 * Métodos em `ticketsService`: `list`, `getById`, `create`, `updateStatus`,
 * `assign`, `getSummary`, `getMetrics`.
 */
export {
  type TicketsService,
  ticketsService,
} from "@/features/tickets/services";
