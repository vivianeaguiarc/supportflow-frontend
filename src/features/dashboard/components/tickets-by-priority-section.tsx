"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TicketPriority } from "@/types/ticket";

import { useAnalyticsByPriority } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatNumber } from "./format";

const PRIORITY_ORDER: TicketPriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

const PRIORITY_META: Record<TicketPriority, { label: string; bar: string }> = {
  URGENT: { label: "Urgente", bar: "bg-red-500" },
  HIGH: { label: "Alta", bar: "bg-amber-500" },
  MEDIUM: { label: "Média", bar: "bg-blue-500" },
  LOW: { label: "Baixa", bar: "bg-emerald-500" },
};

export function TicketsByPrioritySection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsByPriority();

  return (
    <AnalyticsSection
      title="Distribuição por prioridade"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.total === 0}
      emptyDescription="Nenhum chamado para distribuir por prioridade."
      onRetry={() => refetch()}
    >
      {data ? (
        <Card>
          <CardContent className="space-y-4">
            {PRIORITY_ORDER.map((priority) => {
              const count = data.byPriority[priority] ?? 0;
              const percent = data.total > 0 ? (count / data.total) * 100 : 0;
              const meta = PRIORITY_META[priority];

              return (
                <div key={priority} className="space-y-1.5">
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
          </CardContent>
        </Card>
      ) : null}
    </AnalyticsSection>
  );
}
