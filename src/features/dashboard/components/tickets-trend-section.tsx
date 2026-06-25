"use client";

import { useAnalyticsOverview } from "../hooks";
import { DashboardCard } from "./dashboard-card";
import { formatNumber, formatPeriodLabel } from "./format";

export function TicketsTrendSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsOverview();

  const series = data?.ticketsCreatedByPeriod ?? [];
  const max = Math.max(1, ...series.map((point) => point.count));
  const totalCreated = series.reduce((sum, point) => sum + point.count, 0);

  return (
    <DashboardCard
      title="Visão geral de chamados"
      action={
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2.5 rounded-full bg-primary" />
          Chamados criados
        </span>
      }
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={series.length === 0}
      emptyDescription="Sem histórico de chamados criados no período."
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-heading text-2xl font-semibold text-foreground">
            {formatNumber(totalCreated)}
          </span>{" "}
          chamados no período
        </p>

        <div className="flex items-end gap-2">
          {series.map((point) => {
            const heightPercent = (point.count / max) * 100;

            return (
              <div
                key={point.period}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span className="text-xs font-medium text-foreground">
                  {formatNumber(point.count)}
                </span>
                <div className="flex h-32 w-full items-end">
                  <div
                    className="mx-auto w-full max-w-12 rounded-t-md bg-primary/85 transition-colors hover:bg-primary"
                    style={{ height: `${Math.max(heightPercent, 3)}%` }}
                    role="img"
                    aria-label={`${formatPeriodLabel(point.period)}: ${point.count} chamado(s)`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatPeriodLabel(point.period)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}
