"use client";

import { useAgentsPerformance } from "../hooks";
import { DashboardCard } from "./dashboard-card";
import { formatNumber } from "./format";

export function TopAgentsSection() {
  const { data, isLoading, isError, error, refetch } = useAgentsPerformance();

  const ranked = [...(data?.agents ?? [])]
    .sort((a, b) => b.assignedTickets - a.assignedTickets)
    .slice(0, 5);

  const max = Math.max(1, ...ranked.map((agent) => agent.assignedTickets));

  return (
    <DashboardCard
      title="Top agentes por chamados"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={ranked.length === 0}
      emptyDescription="Nenhum agente com chamados atribuídos."
      onRetry={() => refetch()}
    >
      <ul className="space-y-3">
        {ranked.map((agent) => (
          <li key={agent.agentId} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate font-medium text-foreground">
                {agent.agentName}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {formatNumber(agent.assignedTickets)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(agent.assignedTickets / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
