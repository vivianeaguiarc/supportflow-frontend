import type { PriorityLevel } from "@/components/ui/constants";
import { PriorityBadge } from "@/components/ui/priority-badge";

import type { TicketPriority } from "../types";

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const TICKET_PRIORITY_LEVEL: Record<TicketPriority, PriorityLevel> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

/** Badge de prioridade de ticket: mapeia o enum de domínio para o `PriorityBadge` do DS. */
export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  return (
    <PriorityBadge
      level={TICKET_PRIORITY_LEVEL[priority]}
      label={TICKET_PRIORITY_LABELS[priority]}
    />
  );
}
