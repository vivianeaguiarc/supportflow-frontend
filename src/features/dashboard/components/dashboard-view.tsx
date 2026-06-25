"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import { Can } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";

import { dashboardKeys } from "../hooks";
import { AgentsPerformanceSection } from "./agents-performance-section";
import { CsatSection } from "./csat-section";
import { OverviewSection } from "./dashboard-overview";
import { RecentTicketsSection } from "./recent-tickets-section";
import { SlaGaugeSection } from "./sla-gauge-section";
import { TicketsByPrioritySection } from "./tickets-by-priority-section";
import { TicketsByStatusSection } from "./tickets-by-status-section";
import { TicketsTrendSection } from "./tickets-trend-section";
import { TopAgentsSection } from "./top-agents-section";

/**
 * Orquestra as seções de analytics do dashboard.
 *
 * RBAC (espelho do backend):
 * - `analytics:view` (ADMIN, SUPERVISOR): overview, status, prioridade, SLA,
 *   performance por agente.
 * - `analytics:csat` (ADMIN, SUPERVISOR, AGENT): CSAT.
 * Roles sem essas permissões simplesmente não veem as respectivas seções, sem
 * disparar requisições (os componentes só montam dentro de `<Can>`).
 */
export function DashboardView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  function handleRefreshAll() {
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Olá, {user?.name ?? "bem-vindo"}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Aqui está o resumo do atendimento da sua organização.
          </p>
        </div>
        <Button size="sm" onClick={handleRefreshAll}>
          <RefreshCw className="size-4" />
          Atualizar dados
        </Button>
      </div>

      <Can perform="analytics:view">
        <OverviewSection />

        <div className="grid gap-6 lg:grid-cols-3">
          <TicketsTrendSection />
          <TicketsByPrioritySection />
          <SlaGaugeSection />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <TicketsByStatusSection />
          <RecentTicketsSection />
          <TopAgentsSection />
        </div>

        <AgentsPerformanceSection />
      </Can>

      <Can perform="analytics:csat">
        <CsatSection />
      </Can>
    </div>
  );
}
