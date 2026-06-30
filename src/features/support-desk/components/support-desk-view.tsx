"use client";

import { TimerOff } from "lucide-react";
import { useState } from "react";

import { PageSection } from "@/components/ui/page-section";
import { SlaBreachedTicketsTable } from "@/features/tickets/components";
import { useTicketSummary } from "@/features/tickets/hooks";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import type { Ticket } from "@/types/ticket";

import { DESK_QUEUES, type DeskQueueId } from "../lib/desk-queues";
import { DeskCardQueue } from "./desk-card-queue";
import { DeskDetailSheet } from "./desk-detail-sheet";
import { DeskIndicators } from "./desk-indicators";
import { DeskQueueTabs, type DeskTabDef } from "./desk-queue-tabs";

/** Aba especial que consome o endpoint dedicado `GET /tickets/sla/breached`. */
const BREACHED_TAB: DeskTabDef = {
  id: "breached",
  label: "SLA violado",
  icon: TimerOff,
  description: "Chamados ativos que já ultrapassaram o prazo de SLA.",
};

/**
 * Mesa de Atendimento: visão operacional do atendente. Compõe os indicadores,
 * o seletor de filas, a lista compacta de chamados e o painel lateral de
 * detalhe rápido. Tudo apoiado em endpoints reais (`GET /tickets`,
 * `/tickets/summary`, `/tickets/metrics`, `/tickets/sla/breached` e
 * `/tickets/{id}/comments`).
 */
export function SupportDeskView() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>("open");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const summary = useTicketSummary();

  // A aba "SLA violado" consome `GET /tickets/sla/breached`, restrito ao grupo
  // METRICS no backend (ADMIN/SUPERVISOR/AGENT — sem OMBUDSMAN). Só exibimos a
  // aba a quem tem a permissão real, evitando um 403 garantido.
  const canSeeBreached = can("metrics:view");
  const tabs: DeskTabDef[] = canSeeBreached
    ? [...DESK_QUEUES, BREACHED_TAB]
    : [...DESK_QUEUES];

  const counts: Record<string, number | undefined> = {
    open: summary.data?.open,
    unassigned: summary.data?.unassigned,
    overdue: summary.data?.overdue,
    breached: summary.data?.overdue,
  };

  const isBreachedActive = activeTab === "breached" && canSeeBreached;
  const activeDef = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-5">
      <DeskIndicators />

      <PageSection
        title="Filas operacionais"
        description={activeDef?.description}
        density="compact"
      >
        <DeskQueueTabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />

        {isBreachedActive ? (
          <SlaBreachedTicketsTable onOpenTicket={setSelected} />
        ) : (
          <DeskCardQueue
            queueId={activeTab as DeskQueueId}
            currentUserId={user?.id}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        )}
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
