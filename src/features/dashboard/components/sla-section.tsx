"use client";

import { CardStat } from "@/components/ui/card-stat";

import { useAnalyticsSla } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatNumber, formatPercent } from "./format";

export function SlaSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsSla();

  return (
    <AnalyticsSection
      title="Indicadores de SLA"
      description="Cumprimento de prazos dos chamados."
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.total === 0}
      emptyDescription="Sem chamados com SLA monitorado."
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CardStat label="No prazo" value={formatNumber(data.onTime)} />
          <CardStat label="Em risco" value={formatNumber(data.warning)} />
          <CardStat label="Vencidos" value={formatNumber(data.breached)} />
          <CardStat label="Total monitorado" value={formatNumber(data.total)} />
          <CardStat
            label="SLA cumprido"
            value={formatPercent(data.slaComplianceRate)}
          />
          <CardStat
            label="SLA vencido"
            value={formatNumber(data.slaBreachedTickets)}
          />
        </div>
      ) : null}
    </AnalyticsSection>
  );
}
