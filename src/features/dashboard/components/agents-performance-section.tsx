"use client";

import { Card, CardContent } from "@/components/ui/card";

import { useAgentsPerformance } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatHours, formatNumber } from "./format";

export function AgentsPerformanceSection() {
  const { data, isLoading, isError, error, refetch } = useAgentsPerformance();

  return (
    <AnalyticsSection
      title="Performance por agente"
      description="Volume e resolução por responsável."
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.agents.length === 0}
      emptyDescription="Nenhum agente com chamados atribuídos."
      onRetry={() => refetch()}
    >
      {data ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Agente</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Atribuídos
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Resolvidos
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Abertos</th>
                  <th className="px-4 py-3 text-right font-medium">
                    SLA vencido
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Tempo médio
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.agents.map((agent) => (
                  <tr key={agent.agentId} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {agent.agentName}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatNumber(agent.assignedTickets)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatNumber(agent.resolvedTickets)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatNumber(agent.openTickets)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatNumber(agent.slaBreachedTickets)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatHours(agent.avgResolutionTimeHours)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}
    </AnalyticsSection>
  );
}
