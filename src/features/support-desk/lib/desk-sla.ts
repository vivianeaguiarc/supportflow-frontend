import type { Ticket, TicketStatus } from "@/types/ticket";

/**
 * Status terminais: o chamado foi encerrado, então não há SLA "ativo" a vencer.
 * Espelha a regra do backend (RESOLVED/CLOSED não contam como atraso).
 */
export const TERMINAL_TICKET_STATUSES = [
  "RESOLVED",
  "CLOSED",
] as const satisfies readonly TicketStatus[];

export function isTerminalStatus(status: TicketStatus): boolean {
  return (TERMINAL_TICKET_STATUSES as readonly TicketStatus[]).includes(status);
}

/**
 * Janela (ms) na qual um chamado ativo é considerado "próximo do vencimento".
 * Derivação puramente no cliente a partir de `slaDueAt` (dado real de
 * `GET /tickets`) — não inventa endpoint nem altera o backend.
 */
export const SLA_WARNING_WINDOW_MS = 24 * 60 * 60 * 1000;

export type DeskSlaState = "breached" | "warning" | "ok" | "none";

/**
 * Classifica a situação de SLA de um chamado a partir de `slaDueAt` e `status`:
 * - `none`    → status terminal ou sem prazo;
 * - `breached`→ prazo já vencido (atrasado);
 * - `warning` → vence dentro da janela de alerta (próximo do SLA);
 * - `ok`      → ainda há folga.
 */
export function getSlaState(
  ticket: Pick<Ticket, "status" | "slaDueAt">,
  now: Date = new Date(),
): DeskSlaState {
  if (isTerminalStatus(ticket.status)) return "none";
  if (!ticket.slaDueAt) return "none";

  const due = new Date(ticket.slaDueAt).getTime();
  if (Number.isNaN(due)) return "none";

  const diff = due - now.getTime();
  if (diff <= 0) return "breached";
  if (diff <= SLA_WARNING_WINDOW_MS) return "warning";
  return "ok";
}

/**
 * Texto relativo curto para o prazo de SLA (ex.: "vence em 3h",
 * "atrasado 2h", "vence em 45min"). Pensado para chips compactos.
 */
export function formatSlaCountdown(
  slaDueAt: string,
  now: Date = new Date(),
): string {
  const due = new Date(slaDueAt).getTime();
  if (Number.isNaN(due)) return "—";

  const diffMs = due - now.getTime();
  const abs = Math.abs(diffMs);
  const hours = Math.floor(abs / (60 * 60 * 1000));
  const minutes = Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000));
  const amount = hours >= 1 ? `${hours}h` : `${minutes}min`;

  return diffMs >= 0 ? `vence em ${amount}` : `atrasado ${amount}`;
}
