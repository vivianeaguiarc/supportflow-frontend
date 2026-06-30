"use client";

import {
  AlarmClock,
  Clock,
  Headset,
  Inbox,
  Star,
  TimerReset,
  UserX,
} from "lucide-react";

import { Can } from "@/components/auth";
import { CardStat } from "@/components/ui/card-stat";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks";
import { useTicketMetrics, useTicketSummary } from "@/features/tickets/hooks";
import { getErrorMessage } from "@/lib/api-error";

import {
  useAnalyticsCsat,
  useAnalyticsOverview,
  useAnalyticsSla,
} from "../hooks";
import { formatHours, formatNumber, formatRating } from "./format";

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

function CsatKpiCard() {
  const { data, isLoading } = useAnalyticsCsat();

  if (isLoading) return <Skeleton className="h-28 w-full rounded-xl" />;
  if (!data || data.totalSurveys === 0) return null;

  return (
    <CardStat
      label="CSAT"
      value={formatRating(data.averageRating)}
      icon={<Star />}
      accent={
        data.averageRating >= 4
          ? "success"
          : data.averageRating >= 3
            ? "warning"
            : "danger"
      }
      description={`${formatNumber(data.totalSurveys)} pesquisas`}
    />
  );
}

/** Indicadores operacionais para visão de equipe (ADMIN/SUPERVISOR). */
function TeamDashboardKpis() {
  const summary = useTicketSummary();
  const overview = useAnalyticsOverview();
  const sla = useAnalyticsSla();

  const isLoading = summary.isLoading || overview.isLoading || sla.isLoading;
  const isError = summary.isError || overview.isError || sla.isError;
  const error = summary.error ?? overview.error ?? sla.error;

  if (isLoading) return <KpiSkeleton />;

  if (isError || !summary.data) {
    return (
      <ErrorState
        title="Indicadores indisponíveis"
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={() => {
          void summary.refetch();
          void overview.refetch();
          void sla.refetch();
        }}
      />
    );
  }

  const { data } = summary;
  const slaWarning = sla.data?.warning ?? 0;
  const slaBreached =
    sla.data?.breached ?? overview.data?.slaBreachedTickets ?? data.overdue;
  const avgHours = overview.data?.avgResolutionTimeHours ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      <CardStat
        label="Chamados abertos"
        value={formatNumber(data.open)}
        icon={<Inbox />}
        accent="primary"
        description="Aguardando triagem"
      />
      <CardStat
        label="Em atendimento"
        value={formatNumber(data.inProgress)}
        icon={<Headset />}
        accent="info"
        description="Sendo trabalhados agora"
      />
      <CardStat
        label="Sem responsável"
        value={formatNumber(data.unassigned)}
        icon={<UserX />}
        accent={data.unassigned > 0 ? "warning" : "neutral"}
        description="Precisam de atribuição"
      />
      <CardStat
        label="SLA em risco"
        value={formatNumber(slaWarning)}
        icon={<TimerReset />}
        accent={slaWarning > 0 ? "warning" : "success"}
        description="Vencem nas próximas 24h"
      />
      <CardStat
        label="SLA violado"
        value={formatNumber(slaBreached)}
        icon={<AlarmClock />}
        accent={slaBreached > 0 ? "danger" : "success"}
        description="Prazo estourado"
      />
      <CardStat
        label="Tempo médio de resolução"
        value={formatHours(avgHours)}
        icon={<Clock />}
        accent="neutral"
        description="Média da equipe"
      />
      <Can perform="analytics:csat">
        <CsatKpiCard />
      </Can>
    </div>
  );
}

/** Indicadores focados no atendente (AGENT). */
function AgentDashboardKpis() {
  const { user } = useAuth();
  const mySummary = useTicketSummary(
    user?.id ? { assignedToId: user.id } : undefined,
  );
  const teamSummary = useTicketSummary();
  const metrics = useTicketMetrics();

  const isLoading =
    mySummary.isLoading || teamSummary.isLoading || metrics.isLoading;
  const isError = mySummary.isError || teamSummary.isError || metrics.isError;
  const error = mySummary.error ?? teamSummary.error ?? metrics.error;

  if (isLoading) return <KpiSkeleton />;

  if (isError || !mySummary.data || !teamSummary.data) {
    return (
      <ErrorState
        title="Indicadores indisponíveis"
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={() => {
          void mySummary.refetch();
          void teamSummary.refetch();
          void metrics.refetch();
        }}
      />
    );
  }

  const mine = mySummary.data;
  const team = teamSummary.data;
  const avgHours = metrics.data?.avgResolutionTimeHours ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <CardStat
        label="Meus chamados abertos"
        value={formatNumber(mine.open)}
        icon={<Inbox />}
        accent="primary"
        description="Atribuídos a você"
      />
      <CardStat
        label="Meus em atendimento"
        value={formatNumber(mine.inProgress)}
        icon={<Headset />}
        accent="info"
        description="Em progresso"
      />
      <CardStat
        label="Fila sem responsável"
        value={formatNumber(team.unassigned)}
        icon={<UserX />}
        accent={team.unassigned > 0 ? "warning" : "neutral"}
        description="Disponíveis para assumir"
      />
      <CardStat
        label="Meus atrasados"
        value={formatNumber(mine.overdue)}
        icon={<AlarmClock />}
        accent={mine.overdue > 0 ? "danger" : "success"}
        description="SLA estourado"
      />
      <Can perform="metrics:view">
        <CardStat
          label="Tempo médio de resolução"
          value={formatHours(avgHours)}
          icon={<Clock />}
          accent="neutral"
          description="Média da equipe"
        />
      </Can>
      <Can perform="analytics:csat">
        <CsatKpiCard />
      </Can>
    </div>
  );
}

/** Faixa de KPIs operacionais — visão de equipe ou foco do agente. */
export function DashboardKpis() {
  return (
    <Can perform="analytics:view" fallback={<AgentDashboardKpis />}>
      <TeamDashboardKpis />
    </Can>
  );
}
