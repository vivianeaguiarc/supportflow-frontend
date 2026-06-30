"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageSection } from "@/components/ui/page-section";
import { getErrorMessage } from "@/lib/api-error";

import { useAgentsPerformance } from "../hooks";
import { formatHours, formatNumber } from "./format";

/** Performance da equipe — visível apenas para ADMIN/SUPERVISOR. */
export function TeamPerformanceSection() {
  const { data, isLoading, isError, error, refetch } = useAgentsPerformance();

  return (
    <PageSection
      title="Performance da equipe"
      description="Volume, resolução e conformidade de SLA por atendente."
      density="compact"
    >
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          description={getErrorMessage(error, "Tente novamente em instantes.")}
          onRetry={() => refetch()}
        />
      ) : !data || data.agents.length === 0 ? (
        <EmptyState
          title="Sem dados de equipe"
          description="Nenhum agente com chamados atribuídos no período."
        />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Atendente</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Atribuídos
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Resolvidos
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Abertos</th>
                  <th className="px-4 py-3 text-right font-medium">
                    SLA violado
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Tempo médio
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.agents.map((agent) => (
                  <tr
                    key={agent.agentId}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {agent.agentName}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(agent.assignedTickets)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(agent.resolvedTickets)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(agent.openTickets)}
                    </td>
                    <td className="px-4 py-3 text-right text-destructive">
                      {formatNumber(agent.slaBreachedTickets)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatHours(agent.avgResolutionTimeHours)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </PageSection>
  );
}
