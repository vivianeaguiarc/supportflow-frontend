"use client";

import { CircleCheck, CircleSlash, Clock, TriangleAlert } from "lucide-react";

import { CardStat } from "@/components/ui/card-stat";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";

import { useSlaSummary } from "../hooks";

/** Percentual de aderência (no prazo / total), com guarda para total zero. */
function compliancePercent(onTime: number, total: number): number {
  return total > 0 ? Math.round((onTime / total) * 100) : 0;
}

/**
 * Indicadores operacionais de SLA do tenant (`GET /tickets/sla`).
 * Read-only: o backend só expõe os totais agregados por status.
 */
export function SlaSummaryCards() {
  const { data, isLoading, isError, refetch } = useSlaSummary();

  if (isLoading) {
    return <LoadingState label="Carregando indicadores de SLA..." />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar os indicadores de SLA"
        description="Tente novamente em instantes."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CardStat
        label="Chamados ativos"
        value={data.total}
        accent="blue"
        icon={<Clock />}
        description="Total considerado no cálculo de SLA"
      />
      <CardStat
        label="No prazo"
        value={data.onTime}
        accent="emerald"
        icon={<CircleCheck />}
        progress={compliancePercent(data.onTime, data.total)}
        description={`${compliancePercent(data.onTime, data.total)}% de aderência`}
      />
      <CardStat
        label="Em alerta"
        value={data.warning}
        accent="amber"
        icon={<TriangleAlert />}
        description="Próximos do vencimento"
      />
      <CardStat
        label="Violado"
        value={data.breached}
        accent="red"
        icon={<CircleSlash />}
        description="SLA já ultrapassado"
      />
    </div>
  );
}
