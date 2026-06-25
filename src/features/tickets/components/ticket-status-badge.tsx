import type { Tone } from "@/components/ui/constants";
import { StatusBadge } from "@/components/ui/status-badge";

import type { TicketStatus } from "../types";

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  WAITING_CUSTOMER: "Aguardando cliente",
  ESCALATED: "Escalado",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

const TICKET_STATUS_TONE: Record<TicketStatus, Tone> = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  WAITING_CUSTOMER: "muted",
  ESCALATED: "danger",
  RESOLVED: "success",
  CLOSED: "neutral",
};

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

/** Badge de status de ticket: mapeia o enum de domínio para o `StatusBadge` do DS. */
export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  return (
    <StatusBadge
      tone={TICKET_STATUS_TONE[status]}
      label={TICKET_STATUS_LABELS[status]}
    />
  );
}
