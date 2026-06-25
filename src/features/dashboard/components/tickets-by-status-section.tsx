"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { TicketStatus } from "@/types/ticket";

import { useAnalyticsByStatus } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatNumber } from "./format";

const STATUS_ORDER: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
];

const STATUS_META: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: "Aberto", color: "var(--chart-4)" },
  IN_PROGRESS: { label: "Em andamento", color: "var(--chart-1)" },
  WAITING_CUSTOMER: { label: "Aguardando cliente", color: "var(--chart-3)" },
  ESCALATED: { label: "Escalado", color: "var(--chart-5)" },
  RESOLVED: { label: "Resolvido", color: "var(--chart-2)" },
  CLOSED: { label: "Fechado", color: "var(--muted-foreground)" },
};

export function TicketsByStatusSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsByStatus();

  const total = data?.total ?? 0;

  let cursor = 0;
  const stops: string[] = [];
  if (data && total > 0) {
    for (const status of STATUS_ORDER) {
      const count = data.byStatus[status] ?? 0;
      if (count === 0) continue;
      const start = (cursor / total) * 100;
      cursor += count;
      const end = (cursor / total) * 100;
      stops.push(`${STATUS_META[status].color} ${start}% ${end}%`);
    }
  }

  return (
    <AnalyticsSection
      title="Distribuição por status"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={total === 0}
      emptyDescription="Nenhum chamado para distribuir por status."
      onRetry={() => refetch()}
    >
      {data ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative size-40 shrink-0">
              <div
                className="size-full rounded-full"
                style={{
                  backgroundImage: `conic-gradient(${stops.join(", ")})`,
                }}
              />
              <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-card">
                <span className="font-heading text-xl font-semibold text-foreground">
                  {formatNumber(total)}
                </span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>

            <ul className="w-full flex-1 space-y-2">
              {STATUS_ORDER.map((status) => {
                const count = data.byStatus[status] ?? 0;
                const percent =
                  total > 0 ? Math.round((count / total) * 100) : 0;
                const meta = STATUS_META[status];

                return (
                  <li
                    key={status}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      {meta.label}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatNumber(count)}{" "}
                      <span className="text-muted-foreground">
                        ({percent}%)
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </AnalyticsSection>
  );
}
