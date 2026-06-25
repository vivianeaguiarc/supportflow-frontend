/**
 * Tipos e metadados de domínio de notificações, reexportando os contratos
 * canônicos (`src/types/notification.ts`) e centralizando rótulos/ícones por
 * tipo, além de helpers de UI.
 */
import {
  Bell,
  Clock,
  type LucideIcon,
  MessageSquare,
  Paperclip,
  TicketCheck,
  TicketPlus,
  UserPlus,
} from "lucide-react";

import type { NotificationType } from "@/types/notification";

export type {
  MarkAllNotificationsAsReadResponse,
  Notification,
  NotificationType,
  NotificationWithTicket,
  TicketSummaryRef,
} from "@/types/notification";

/** Query params de `GET /notifications`. */
export interface ListNotificationsParams {
  unread?: boolean;
  limit?: number;
  offset?: number;
}

/** Ícone + rótulo legível (pt-BR) por tipo de notificação. */
export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  { label: string; icon: LucideIcon }
> = {
  TICKET_CREATED: { label: "Chamado criado", icon: TicketPlus },
  TICKET_ASSIGNED: { label: "Chamado atribuído", icon: UserPlus },
  TICKET_STATUS_CHANGED: { label: "Status alterado", icon: TicketCheck },
  TICKET_COMMENT_ADDED: { label: "Novo comentário", icon: MessageSquare },
  TICKET_ATTACHMENT_ADDED: { label: "Novo anexo", icon: Paperclip },
  SLA_WARNING: { label: "SLA próximo do vencimento", icon: Clock },
  SLA_EXPIRED: { label: "SLA vencido", icon: Bell },
};

/** Tempo relativo curto em pt-BR (ex.: "agora", "há 5 min", "há 2 h"). */
export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return "agora";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `há ${diffHour} h`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `há ${diffDay} d`;

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}
