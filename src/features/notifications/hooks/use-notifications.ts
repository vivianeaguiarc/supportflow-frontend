import { useQuery } from "@tanstack/react-query";

import { notificationsService } from "../services";
import type { ListNotificationsParams } from "../types";
import { notificationsKeys } from "./notifications-keys";

/** Intervalo de polling para manter as notificações relativamente frescas. */
export const NOTIFICATIONS_POLL_INTERVAL_MS = 60_000;

/**
 * Parâmetros da listagem compartilhada entre o popover do header, a página
 * `/notifications` (filtro "todas") e o sincronizador de eventos
 * (`useNotificationsSync`). Usar os MESMOS params garante uma única query no
 * React Query (dedupe), evitando requisições duplicadas.
 *
 * ⚠️ Não enviamos `limit`/`offset`: o backend retorna HTTP 500 quando o
 * `limit` é informado em `GET /notifications` (apesar de documentado no
 * OpenAPI). Buscamos a lista completa (ordenada por mais recentes) e fatiamos no
 * cliente — ver `RECENT_NOTIFICATIONS_DISPLAY_LIMIT`. Reverter para `{ limit }`
 * assim que o bug de paginação for corrigido no backend.
 */
export const RECENT_NOTIFICATIONS_PARAMS: ListNotificationsParams = {};

/** Quantidade de notificações exibidas no popover (recorte client-side). */
export const RECENT_NOTIFICATIONS_DISPLAY_LIMIT = 10;

/** Lista as notificações do usuário, com polling leve em segundo plano. */
export function useNotifications(params: ListNotificationsParams = {}) {
  return useQuery({
    queryKey: notificationsKeys.list(params),
    queryFn: () => notificationsService.list(params),
    staleTime: 30_000,
    refetchInterval: NOTIFICATIONS_POLL_INTERVAL_MS,
    // Pausa o polling quando a aba não está em foco (padrão do React Query),
    // retomando + refazendo o fetch ao retornar o foco.
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
