"use client";

import type { TicketPriority } from "@/types/ticket";

import { useAnalyticsByPriority } from "../hooks";
import { DashboardCard } from "./dashboard-card";
import { formatNumber } from "./format";

const PRIORITY_ORDER: TicketPriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> =
  {
    URGENT: { label: "Urgente", color: "var(--chart-5)" },
    HIGH: { label: "Alta", color: "var(--chart-3)" },
    MEDIUM: { label: "Média", color: "var(--chart-1)" },
    LOW: { label: "Baixa", color: "var(--chart-2)" },
  };

export function TicketsByPrioritySection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsByPriority();

  const total = data?.total ?? 0;

  let cursor = 0;
  const stops: string[] = [];
  if (data && total > 0) {
    for (const priority of PRIORITY_ORDER) {
      const count = data.byPriority[priority] ?? 0;
      if (count === 0) continue;
      const start = (cursor / total) * 100;
      cursor += count;
      const end = (cursor / total) * 100;
      stops.push(`${PRIORITY_META[priority].color} ${start}% ${end}%`);
    }
  }

  return (
    <DashboardCard
      title="Distribuição por prioridade"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={total === 0}
      emptyDescription="Nenhum chamado para distribuir por prioridade."
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative size-36 shrink-0">
            <div
              className="size-full rounded-full"
              style={{ backgroundImage: `conic-gradient(${stops.join(", ")})` }}
            />
            <div className="absolute inset-[24%] flex flex-col items-center justify-center rounded-full bg-card">
              <span className="font-heading text-xl font-semibold text-foreground">
                {formatNumber(total)}
              </span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>

          <ul className="w-full flex-1 space-y-2">
            {PRIORITY_ORDER.map((priority) => {
              const count = data.byPriority[priority] ?? 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              const meta = PRIORITY_META[priority];

              return (
                <li
                  key={priority}
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
                    <span className="text-muted-foreground">({percent}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </DashboardCard>
  );
}
