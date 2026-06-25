/**
 * Contratos de notificações.
 * Fonte da verdade: OpenAPI do supportflow-backend (tag "Notifications",
 * rotas `/notifications`, schemas `Notification`, `NotificationWithTicket`,
 * `NotificationType`, `TicketSummaryRef`).
 */

/** Tipos de notificação emitidos pelo backend. */
export type NotificationType =
  | "TICKET_CREATED"
  | "TICKET_ASSIGNED"
  | "TICKET_STATUS_CHANGED"
  | "TICKET_COMMENT_ADDED"
  | "TICKET_ATTACHMENT_ADDED"
  | "SLA_WARNING"
  | "SLA_EXPIRED";

/** Referência resumida do chamado relacionado (`TicketSummaryRef`). */
export interface TicketSummaryRef {
  id: string;
  protocol: string;
  title: string;
}

/** Entidade `Notification` (recurso cru dentro do envelope). */
export interface Notification {
  id: string;
  tenantId: string;
  recipientId: string;
  ticketId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  /** ISO date-time de leitura, ou `null` se não lida. */
  readAt: string | null;
  createdAt: string;
}

/** Notificação com o chamado relacionado (usada na listagem). */
export interface NotificationWithTicket extends Notification {
  ticket?: TicketSummaryRef;
}

/** Resposta de `PATCH /notifications/read-all`. */
export interface MarkAllNotificationsAsReadResponse {
  count: number;
}
