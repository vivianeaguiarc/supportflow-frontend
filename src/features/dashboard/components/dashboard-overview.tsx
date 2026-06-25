"use client";

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
            />
            <CardStat label="Abertos" value={formatNumber(data.openTickets)} />
            <CardStat
              label="Em andamento"
              value={formatNumber(data.inProgressTickets)}
            />
            <CardStat
              label="Resolvidos"
              value={formatNumber(data.resolvedTickets)}
            />
            <CardStat
              label="Fechados"
              value={formatNumber(data.closedTickets)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <CardStat
              label="SLA cumprido"
              value={formatPercent(data.slaComplianceRate)}
            />
            <CardStat
              label="Tempo médio de resolução"
              value={formatHours(data.avgResolutionTimeHours)}
            />
            <CardStat
              label="SLA vencido"
              value={formatNumber(data.slaBreachedTickets)}
            />
          </div>
        </div>
      ) : null}
    </AnalyticsSection>
  );
}
