import { useQuery } from "@tanstack/react-query";

import { notificationsService } from "../services";
import type { ListNotificationsParams } from "../types";
import { notificationsKeys } from "./notifications-keys";

/** Intervalo de polling para manter as notificações relativamente frescas. */
const REFETCH_INTERVAL_MS = 60_000;

/** Lista as notificações do usuário, com polling leve em segundo plano. */
export function useNotifications(params: ListNotificationsParams = {}) {
  return useQuery({
    queryKey: notificationsKeys.list(params),
    queryFn: () => notificationsService.list(params),
    staleTime: 30_000,
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}
