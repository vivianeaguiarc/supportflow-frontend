"use client";

import type { Ticket } from "@/types/ticket";

import { useDeskQueue } from "../hooks";
import type { DeskQueueId } from "../lib/desk-queues";
import { DeskQueueList } from "./desk-queue-list";

interface DeskCardQueueProps {
  queueId: DeskQueueId;
  currentUserId: string | undefined;
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
}

/**
 * Fila de chamados em cartões compactos (apoiada em `GET /tickets`). Isolada em
 * componente próprio para que o hook de dados só seja montado quando a aba de
 * fila está ativa (a aba "SLA violado" usa outro endpoint/tabela).
 */
export function DeskCardQueue({
  queueId,
  currentUserId,
  selectedId,
  onSelect,
}: DeskCardQueueProps) {
  const queue = useDeskQueue(queueId, currentUserId);

  return (
    <DeskQueueList
      tickets={queue.tickets}
      isLoading={queue.isLoading}
      isError={queue.isError}
      error={queue.error}
      onRetry={() => queue.refetch()}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
