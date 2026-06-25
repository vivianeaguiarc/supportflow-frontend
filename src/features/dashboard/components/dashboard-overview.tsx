"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Inbox,
  Layers,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { CardStat } from "@/components/ui/card-stat";

import { useAnalyticsOverview } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatHours, formatNumber, formatPercent } from "./format";

export function OverviewSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsOverview();

  return (
    <AnalyticsSection
      title="Indicadores gerais"
      description="Visão consolidada dos chamados do tenant."
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.totalTickets === 0}
      emptyDescription="Nenhum chamado registrado ainda."
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <CardStat
              label="Total de chamados"
              value={formatNumber(data.totalTickets)}
              icon={<Layers />}
              accent="blue"
            />
            <CardStat
              label="Abertos"
              value={formatNumber(data.openTickets)}
              icon={<FileText />}
              accent="emerald"
            />
            <CardStat
              label="Em andamento"
              value={formatNumber(data.inProgressTickets)}
              icon={<Clock />}
              accent="amber"
            />
            <CardStat
              label="Resolvidos"
              value={formatNumber(data.resolvedTickets)}
              icon={<CheckCircle2 />}
              accent="blue"
            />
            <CardStat
              label="Fechados"
              value={formatNumber(data.closedTickets)}
              icon={<Inbox />}
              accent="neutral"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <CardStat
              label="SLA cumprido"
              value={formatPercent(data.slaComplianceRate)}
              icon={<ShieldCheck />}
              accent="emerald"
              progress={data.slaComplianceRate}
            />
            <CardStat
              label="Tempo médio de resolução"
              value={formatHours(data.avgResolutionTimeHours)}
              icon={<Timer />}
              accent="blue"
            />
            <CardStat
              label="SLA vencido"
              value={formatNumber(data.slaBreachedTickets)}
              icon={<AlertTriangle />}
              accent="red"
            />
          </div>
        </div>
      ) : null}
    </AnalyticsSection>
  );
}
