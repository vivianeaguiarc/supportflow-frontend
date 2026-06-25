import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";
import type {
  MarkAllNotificationsAsReadResponse,
  NotificationWithTicket,
} from "@/types/notification";

import type { ListNotificationsParams } from "../types";

/**
 * Camada de integração com os endpoints reais de notificações do usuário.
 *
 * Passa pelos route handlers BFF (`local: true`), que injetam o Bearer a partir
 * do cookie HttpOnly. As respostas são desembrulhadas com `unwrap()`.
 */
export const notificationsService = {
  /** `GET /notifications` — lista do usuário (mais recentes primeiro). */
  async list(
    params: ListNotificationsParams = {},
  ): Promise<NotificationWithTicket[]> {
    const response = await httpClient<NotificationWithTicket[]>(
      "/api/notifications",
      {
        local: true,
        params: {
          unread: params.unread ? true : undefined,
          limit: params.limit,
          offset: params.offset,
        },
      },
    );
    return unwrap<NotificationWithTicket[]>(response);
  },

  /** `PATCH /notifications/{id}/read` — marca uma notificação como lida. */
  async markAsRead(id: string): Promise<void> {
    await httpClient<void>(
      `/api/notifications/${encodeURIComponent(id)}/read`,
      { method: "PATCH", local: true },
    );
  },

  /** `PATCH /notifications/read-all` — marca todas como lidas; retorna `count`. */
  async markAllAsRead(): Promise<MarkAllNotificationsAsReadResponse> {
    const response = await httpClient<MarkAllNotificationsAsReadResponse>(
      "/api/notifications/read-all",
      { method: "PATCH", local: true },
    );
    return unwrap<MarkAllNotificationsAsReadResponse>(response);
  },
};

export type NotificationsService = typeof notificationsService;
