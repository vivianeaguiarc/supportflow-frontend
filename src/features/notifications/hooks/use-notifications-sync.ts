"use client";

import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { attachmentsKeys } from "@/features/attachments/hooks";
import { commentsKeys } from "@/features/comments/hooks";
import { dashboardKeys } from "@/features/dashboard/hooks";
import { ticketsKeys } from "@/features/tickets/hooks";
import { notify } from "@/lib/notifications";

import type { NotificationWithTicket } from "../types";
import {
  RECENT_NOTIFICATIONS_PARAMS,
  useNotifications,
} from "./use-notifications";

/**
 * Traduz uma notificação recém-chegada em invalidações de cache direcionadas.
 *
 * Como não há WebSocket/SSE, o polling de notificações funciona como um "event
 * stream" pobre: ao detectar um evento novo, invalidamos exatamente as queries
 * afetadas. Queries sem observers ativos só ficam *stale* (barato); as que estão
 * na tela são refeitas — é assim que a página do ticket reflete um novo
 * comentário "quase em tempo real".
 */
function invalidateForNotification(
  queryClient: QueryClient,
  notification: NotificationWithTicket,
): void {
  const ticketId = notification.ticketId;

  switch (notification.type) {
    case "TICKET_COMMENT_ADDED":
      if (ticketId) {
        void queryClient.invalidateQueries({
          queryKey: commentsKeys.list(ticketId),
        });
        void queryClient.invalidateQueries({
          queryKey: ticketsKeys.history(ticketId),
        });
      }
      break;

    case "TICKET_ATTACHMENT_ADDED":
      if (ticketId) {
        void queryClient.invalidateQueries({
          queryKey: attachmentsKeys.list(ticketId),
        });
        void queryClient.invalidateQueries({
          queryKey: ticketsKeys.history(ticketId),
        });
      }
      break;

    case "TICKET_STATUS_CHANGED":
    case "TICKET_ASSIGNED":
      if (ticketId) {
        void queryClient.invalidateQueries({
          queryKey: ticketsKeys.detail(ticketId),
        });
        void queryClient.invalidateQueries({
          queryKey: ticketsKeys.history(ticketId),
        });
      }
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.summary() });
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.metrics() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      break;

    case "TICKET_CREATED":
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.summary() });
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.metrics() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      break;

    case "SLA_WARNING":
    case "SLA_EXPIRED":
      if (ticketId) {
        void queryClient.invalidateQueries({
          queryKey: ticketsKeys.detail(ticketId),
        });
      }
      void queryClient.invalidateQueries({ queryKey: ticketsKeys.lists() });
      break;

    default:
      break;
  }
}

/**
 * Sincroniza o cache do app com eventos vindos das notificações (polling).
 *
 * Reusa a MESMA query `useNotifications(RECENT_NOTIFICATIONS_PARAMS)` do popover
 * (dedupe — sem request extra). Mantém um conjunto de IDs já vistos: a cada
 * atualização, identifica os eventos novos e (a) invalida as queries afetadas e
 * (b) dispara um toast informativo quando um novo comentário chega. A primeira
 * carga apenas semeia o conjunto, sem invalidar nem notificar.
 */
export function useNotificationsSync(): void {
  const queryClient = useQueryClient();
  const { data } = useNotifications(RECENT_NOTIFICATIONS_PARAMS);
  const seenIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!data) return;

    // Primeira carga: semeia o baseline sem reagir (evita "enxurrada" inicial).
    if (seenIdsRef.current === null) {
      seenIdsRef.current = new Set(data.map((item) => item.id));
      return;
    }

    const seen = seenIdsRef.current;
    const fresh = data.filter((item) => !seen.has(item.id));
    if (fresh.length === 0) return;

    for (const notification of fresh) {
      seen.add(notification.id);
      invalidateForNotification(queryClient, notification);
    }

    // Toast (apenas o que é relevante para o usuário): novos comentários.
    const newComments = fresh.filter(
      (item) => item.type === "TICKET_COMMENT_ADDED",
    );
    if (newComments.length === 1) {
      notify.info(newComments[0].title, {
        description: newComments[0].message,
      });
    } else if (newComments.length > 1) {
      notify.info(`${newComments.length} novos comentários`);
    }
  }, [data, queryClient]);
}
