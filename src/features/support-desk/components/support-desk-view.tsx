"use client";

import { useState } from "react";

import { PageSection } from "@/components/ui/page-section";
import { useTicketSummary } from "@/features/tickets/hooks";
import { useAuth } from "@/hooks/use-auth";
import type { Ticket } from "@/types/ticket";

import { useDeskQueue } from "../hooks";
import { DESK_QUEUES, type DeskQueueId } from "../lib/desk-queues";
import { DeskDetailSheet } from "./desk-detail-sheet";
import { DeskIndicators } from "./desk-indicators";
import { DeskQueueList } from "./desk-queue-list";
import { DeskQueueTabs } from "./desk-queue-tabs";

/**
 * Mesa de Atendimento: visão operacional do atendente. Compõe os indicadores,
 * o seletor de filas, a lista compacta de chamados e o painel lateral de
 * detalhe rápido. Tudo apoiado em endpoints reais (`GET /tickets`,
 * `/tickets/summary`, `/tickets/metrics` e `/tickets/{id}/comments`).
 */
export function SupportDeskView() {
  const { user } = useAuth();
  const [activeQueue, setActiveQueue] = useState<DeskQueueId>("open");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const summary = useTicketSummary();
  const queue = useDeskQueue(activeQueue, user?.id);

  const counts: Partial<Record<DeskQueueId, number>> = {
    open: summary.data?.open,
    unassigned: summary.data?.unassigned,
    overdue: summary.data?.overdue,
  };

  const activeDef = DESK_QUEUES.find((q) => q.id === activeQueue);

  return (
    <div className="space-y-6">
      <DeskIndicators />

      <PageSection
        title="Filas operacionais"
        description={activeDef?.description}
      >
        <DeskQueueTabs
          active={activeQueue}
          onChange={setActiveQueue}
          counts={counts}
        />

        <DeskQueueList
          tickets={queue.tickets}
          isLoading={queue.isLoading}
          isError={queue.isError}
          error={queue.error}
          onRetry={() => queue.refetch()}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </PageSection>

      <DeskDetailSheet
        ticket={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
