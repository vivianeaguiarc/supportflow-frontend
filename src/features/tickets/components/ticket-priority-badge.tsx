import { Badge } from "@/components/ui/badge";

import type { TicketPriority } from "../types";

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const priorityVariants: Record<
  TicketPriority,
  "default" | "secondary" | "outline" | "destructive"
> = {
  LOW: "secondary",
  MEDIUM: "outline",
  HIGH: "default",
  URGENT: "destructive",
};

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  return (
    <Badge variant={priorityVariants[priority]}>
      {TICKET_PRIORITY_LABELS[priority]}
    </Badge>
  );
}
