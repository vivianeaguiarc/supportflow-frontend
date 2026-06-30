"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Headset, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Can } from "@/components/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/features/auth/hooks";
import { ticketsKeys } from "@/features/tickets/hooks";
import { MESSAGES, notify } from "@/lib/notifications";
import { cn } from "@/lib/utils";

import { dashboardKeys } from "../hooks";
import { CriticalQueueSection } from "./critical-queue-section";
import { CsatSection } from "./csat-section";
import { DashboardKpis } from "./dashboard-kpis";
import { MyTicketsSection } from "./my-tickets-section";
import { RecentActivitySection } from "./recent-activity-section";
import { SlaAtRiskSection } from "./sla-at-risk-section";
import { TeamPerformanceSection } from "./team-performance-section";

/**
 * Central de Atendimento — dashboard operacional focado em filas, SLA e
 * performance da equipe. RBAC:
 * - `analytics:view` (ADMIN/SUPERVISOR): visão geral da equipe.
 * - AGENT: foco em chamados atribuídos e filas disponíveis.
 * - `analytics:csat`: satisfação quando disponível no contrato.
 */
export function DashboardView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  function handleRefreshAll() {
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
      queryClient.invalidateQueries({ queryKey: ticketsKeys.all }),
    ]).then(() => notify.success(MESSAGES.dashboard.refreshed));
  }

  return (
    <>
      <PageHeader
        variant="operational"
        title="Central de Atendimento"
        description={
          <>
            Olá, <strong>{user?.name ?? "bem-vindo"}</strong> — monitore filas,
            prazos de SLA e a performance da operação em tempo real.
          </>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/support-desk"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Headset className="size-4" aria-hidden />
              Mesa de Atendimento
            </Link>
            <Button size="sm" onClick={handleRefreshAll}>
              <RefreshCw className="size-4" aria-hidden />
              Atualizar
            </Button>
          </div>
        }
      />

      <DashboardKpis />

      <div className="grid gap-6 lg:grid-cols-2">
        <CriticalQueueSection />
        <MyTicketsSection />
      </div>

      <SlaAtRiskSection />
      <RecentActivitySection />

      <Can perform="analytics:view">
        <TeamPerformanceSection />
      </Can>

      <Can perform="analytics:csat">
        <CsatSection />
      </Can>
    </>
  );
}
