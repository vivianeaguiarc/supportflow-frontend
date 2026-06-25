"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import { Can } from "@/components/auth";
import { Button } from "@/components/ui/button";

import { dashboardKeys } from "../hooks";
import { AgentsPerformanceSection } from "./agents-performance-section";
import { CsatSection } from "./csat-section";
import { OverviewSection } from "./dashboard-overview";
import { SlaSection } from "./sla-section";
import { TicketsByPrioritySection } from "./tickets-by-priority-section";
import { TicketsByStatusSection } from "./tickets-by-status-section";

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

  function handleRefreshAll() {
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleRefreshAll}>
          <RefreshCw className="size-4" />
          Atualizar dados
        </Button>
      </div>

      <Can perform="analytics:view">
        <OverviewSection />
        <div className="grid gap-8 lg:grid-cols-2">
          <TicketsByStatusSection />
          <TicketsByPrioritySection />
        </div>
        <SlaSection />
        <AgentsPerformanceSection />
      </Can>

      <Can perform="analytics:csat">
        <CsatSection />
      </Can>
    </div>
  );
}
