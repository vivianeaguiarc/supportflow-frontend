import { Badge } from "@/components/ui/badge";
import type { TicketStatus } from "@/types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  WAITING_CUSTOMER: "Aguardando cliente",
  ESCALATED: "Escalado",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  return <Badge variant="outline">{statusLabels[status]}</Badge>;
}
