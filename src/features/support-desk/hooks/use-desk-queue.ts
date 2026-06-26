"use client";

import { useMemo } from "react";

import { useTickets } from "@/features/tickets/hooks";
import type { Ticket } from "@/types/ticket";

import { buildQueueParams, type DeskQueueId } from "../lib/desk-queues";
import { getSlaState } from "../lib/desk-sla";

/**
 * Carrega a fila ativa da Mesa de Atendimento a partir de `GET /tickets`.
 *
 * Reaproveita `useTickets` (mesmo cache/keys da feature de tickets) e expõe a
 * lista já normalizada em `tickets`. Para a fila "próximos do SLA" (`dueSoon`),
 * que não tem filtro dedicado no backend, a janela de alerta é aplicada no
 * cliente sobre os dados reais (ordenados por `slaDueAt`).
 */
export function useDeskQueue(
  queueId: DeskQueueId,
  currentUserId: string | undefined,
) {
  const params = useMemo(
    () => buildQueueParams(queueId, currentUserId),
    [queueId, currentUserId],
  );

  const query = useTickets(params);

  const tickets = useMemo<Ticket[]>(() => {
    const list = query.data?.data ?? [];
    if (queueId !== "dueSoon") return list;

    const now = new Date();
    return list.filter((ticket) => getSlaState(ticket, now) === "warning");
  }, [query.data, queueId]);

  return { ...query, tickets };
}
