import {
  AlarmClock,
  Inbox,
  type LucideIcon,
  TimerReset,
  UserCheck,
  UserX,
} from "lucide-react";

import type { ListTicketsParams } from "@/types/ticket";

/** Filas operacionais da Mesa de Atendimento. */
export type DeskQueueId =
  | "open"
  | "mine"
  | "unassigned"
  | "dueSoon"
  | "overdue";

export interface DeskQueueDef {
  id: DeskQueueId;
  label: string;
  icon: LucideIcon;
  description: string;
  /** Fila que depende do usuário logado (ex.: "atribuídos a mim"). */
  requiresUser?: boolean;
  /**
   * `true` quando a fila não tem filtro 1:1 no backend e é derivada no cliente
   * a partir de `GET /tickets` (ex.: "próximos do SLA" = ordenar por prazo e
   * filtrar a janela de alerta sobre os dados reais).
   */
  clientDerived?: boolean;
}

/** Tamanho de página das filas (visão operacional, não paginação completa). */
export const DESK_QUEUE_PAGE_SIZE = 25;

export const DESK_QUEUES: readonly DeskQueueDef[] = [
  {
    id: "open",
    label: "Abertos",
    icon: Inbox,
    description: "Chamados abertos aguardando triagem (mais antigos primeiro).",
  },
  {
    id: "mine",
    label: "Meus chamados",
    icon: UserCheck,
    description: "Atribuídos a você, por prazo de SLA mais próximo.",
    requiresUser: true,
  },
  {
    id: "unassigned",
    label: "Sem responsável",
    icon: UserX,
    description: "Aguardando atribuição a um atendente.",
  },
  {
    id: "dueSoon",
    label: "Próximos do SLA",
    icon: TimerReset,
    description: "Chamados ativos que vencem nas próximas 24h.",
    clientDerived: true,
  },
  {
    id: "overdue",
    label: "Atrasados",
    icon: AlarmClock,
    description: "SLA estourado — priorize a resolução.",
  },
] as const;

/**
 * Monta os filtros de `GET /tickets` para cada fila usando apenas parâmetros
 * reais aceitos pelo backend (`status`, `assignedToId`, `unassigned`, `overdue`,
 * `sortBy`, `sortOrder`, `limit`).
 *
 * "Próximos do SLA" (`dueSoon`) não tem filtro dedicado no backend: pedimos os
 * chamados ordenados por `slaDueAt` ascendente e a janela de alerta é aplicada
 * no cliente (ver `useDeskQueue`).
 */
export function buildQueueParams(
  queueId: DeskQueueId,
  currentUserId: string | undefined,
): ListTicketsParams {
  const limit = DESK_QUEUE_PAGE_SIZE;

  switch (queueId) {
    case "open":
      return { status: "OPEN", sortBy: "createdAt", sortOrder: "asc", limit };
    case "mine":
      return {
        assignedToId: currentUserId,
        sortBy: "slaDueAt",
        sortOrder: "asc",
        limit,
      };
    case "unassigned":
      return { unassigned: true, sortBy: "createdAt", sortOrder: "asc", limit };
    case "dueSoon":
      return { sortBy: "slaDueAt", sortOrder: "asc", limit };
    case "overdue":
      return { overdue: true, sortBy: "slaDueAt", sortOrder: "asc", limit };
  }
}
