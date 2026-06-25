"use client";

import { useAnalyticsSla } from "../hooks";
import { DashboardCard } from "./dashboard-card";
import { formatNumber, formatPercent } from "./format";

const BREAKDOWN: {
  key: "onTime" | "warning" | "breached";
  label: string;
  color: string;
}[] = [
  { key: "onTime", label: "No prazo", color: "var(--chart-2)" },
  { key: "warning", label: "Em risco", color: "var(--chart-3)" },
  { key: "breached", label: "Vencidos", color: "var(--chart-5)" },
];

export function SlaGaugeSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsSla();

  const rate = Math.max(0, Math.min(100, data?.slaComplianceRate ?? 0));

  return (
    <DashboardCard
      title="SLA (Acordos de nível de serviço)"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.total === 0}
      emptyDescription="Sem chamados com SLA monitorado."
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="flex flex-col items-center gap-6">
          <div className="relative size-36 shrink-0">
            <div
              className="size-full rounded-full"
              style={{
                backgroundImage: `conic-gradient(var(--chart-2) 0% ${rate}%, var(--muted) ${rate}% 100%)`,
              }}
            />
            <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-card text-center">
              <span className="font-heading text-2xl font-semibold text-foreground">
                {formatPercent(rate)}
              </span>
              <span className="text-xs text-muted-foreground">
                SLA cumprido
              </span>
            </div>
          </div>

          <ul className="w-full space-y-2">
            {BREAKDOWN.map(({ key, label, color }) => (
              <li
                key={key}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </span>
                <span className="font-medium text-foreground">
                  {formatNumber(data[key])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DashboardCard>
  );
}
