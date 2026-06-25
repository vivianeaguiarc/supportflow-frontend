import { useQuery } from "@tanstack/react-query";

import { notificationsService } from "../services";
import { notificationsKeys } from "./notifications-keys";

const UNREAD_PARAMS = { unread: true } as const;
const REFETCH_INTERVAL_MS = 60_000;

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
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}
