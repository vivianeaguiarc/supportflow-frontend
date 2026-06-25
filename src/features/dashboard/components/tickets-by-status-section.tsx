"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TicketStatusBadge } from "@/features/tickets/components";
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

export function TicketsByStatusSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsByStatus();

  return (
    <AnalyticsSection
      title="Distribuição por status"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.total === 0}
      emptyDescription="Nenhum chamado para distribuir por status."
      onRetry={() => refetch()}
    >
      {data ? (
        <Card>
          <CardContent className="space-y-3">
            {STATUS_ORDER.map((status) => (
              <div
                key={status}
                className="flex items-center justify-between gap-2"
              >
                <TicketStatusBadge status={status} />
                <span className="text-sm font-medium text-foreground">
                  {formatNumber(data.byStatus[status] ?? 0)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </AnalyticsSection>
  );
}
