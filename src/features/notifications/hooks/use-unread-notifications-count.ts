import { useQuery } from "@tanstack/react-query";

import { notificationsService } from "../services";
import { notificationsKeys } from "./notifications-keys";
import { NOTIFICATIONS_POLL_INTERVAL_MS } from "./use-notifications";

const UNREAD_PARAMS = { unread: true } as const;

/**
 * Total de notificações não lidas, para o badge do sino. Mantém uma query
 * própria (`unread: true`) para o contador refletir o total real, não apenas a
 * janela exibida no painel.
 */
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationsKeys.list(UNREAD_PARAMS),
    queryFn: () => notificationsService.list(UNREAD_PARAMS),
    select: (data) => data.length,
    staleTime: 30_000,
    refetchInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
