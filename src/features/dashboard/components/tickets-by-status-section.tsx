"use client";

import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/types/ticket";

import { useAnalyticsByStatus } from "../hooks";
import { DashboardCard } from "./dashboard-card";
import { formatNumber } from "./format";

const STATUS_ORDER: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
];

const STATUS_META: Record<TicketStatus, { label: string; bar: string }> = {
  OPEN: { label: "Abertos", bar: "bg-sky-500" },
  IN_PROGRESS: { label: "Em andamento", bar: "bg-blue-500" },
  WAITING_CUSTOMER: { label: "Aguardando cliente", bar: "bg-amber-500" },
  ESCALATED: { label: "Escalados", bar: "bg-red-500" },
  RESOLVED: { label: "Resolvidos", bar: "bg-emerald-500" },
  CLOSED: { label: "Fechados", bar: "bg-slate-400" },
};

export function TicketsByStatusSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsByStatus();

  const total = data?.total ?? 0;

  return (
    <DashboardCard
      title="Chamados por status"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={total === 0}
      emptyDescription="Nenhum chamado para distribuir por status."
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="space-y-4">
          {STATUS_ORDER.map((status) => {
            const count = data.byStatus[status] ?? 0;
            const percent = total > 0 ? (count / total) * 100 : 0;
            const meta = STATUS_META[status];

            return (
              <div key={status} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {meta.label}
                  </span>
                  <span className="text-muted-foreground">
                    {formatNumber(count)} ({Math.round(percent)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", meta.bar)}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </DashboardCard>
  );
}
