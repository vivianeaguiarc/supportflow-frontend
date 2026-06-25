"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TicketPriorityBadge } from "@/features/tickets/components";
import type { TicketPriority } from "@/types/ticket";

import { useAnalyticsByPriority } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatNumber } from "./format";

const PRIORITY_ORDER: TicketPriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

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
          <CardContent className="space-y-3">
            {PRIORITY_ORDER.map((priority) => (
              <div
                key={priority}
                className="flex items-center justify-between gap-2"
              >
                <TicketPriorityBadge priority={priority} />
                <span className="text-sm font-medium text-foreground">
                  {formatNumber(data.byPriority[priority] ?? 0)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </AnalyticsSection>
  );
}
