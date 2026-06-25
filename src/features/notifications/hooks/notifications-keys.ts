import type { ListNotificationsParams } from "../types";

/** Query keys das notificações (hierárquicas para invalidação ampla). */
export const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
  list: (params: ListNotificationsParams) =>
    [...notificationsKeys.lists(), params] as const,
};
