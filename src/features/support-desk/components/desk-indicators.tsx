"use client";

import { AlarmClock, Inbox, ShieldCheck, UserX } from "lucide-react";

import { Can } from "@/components/auth";
import { CardStat } from "@/components/ui/card-stat";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useTicketMetrics, useTicketSummary } from "@/features/tickets/hooks";
import { getErrorMessage } from "@/lib/api-error";

function IndicatorsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

/**
 * Cartão de conformidade de SLA isolado para que `GET /tickets/metrics` (grupo
 * METRICS no backend, sem OMBUDSMAN) só seja chamado por quem tem permissão —
 * evita um 403 desnecessário para papéis que veem a mesa mas não as métricas.
 */
function SlaComplianceCard() {
  const { data, isLoading, isError } = useTicketMetrics();

  if (isLoading) return <Skeleton className="h-28 w-full rounded-xl" />;
  if (isError || !data) return null;

  const rate = Math.round(data.slaComplianceRate);

  return (
    <CardStat
      label="Conformidade de SLA"
      value={`${rate}%`}
      icon={<ShieldCheck />}
      accent={rate >= 90 ? "emerald" : rate >= 70 ? "amber" : "red"}
      progress={rate}
      description={`${data.resolvedTickets} resolvidos · ${data.avgResolutionTimeHours.toFixed(1)}h em média`}
    />
  );
}

/** Faixa de indicadores operacionais no topo da Mesa de Atendimento. */
export function DeskIndicators() {
  const { data, isLoading, isError, error, refetch } = useTicketSummary();

  if (isLoading) return <IndicatorsSkeleton />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar os indicadores"
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={() => refetch()}
      />
    );
  }

  const active = data.open + data.inProgress + data.waitingCustomer;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CardStat
        label="Em aberto"
        value={data.open}
        icon={<Inbox />}
        accent="blue"
        description={`${active} chamados ativos no total`}
      />
      <CardStat
        label="Sem responsável"
        value={data.unassigned}
        icon={<UserX />}
        accent={data.unassigned > 0 ? "amber" : "neutral"}
        description="Aguardando atribuição"
      />
      <CardStat
        label="Atrasados"
        value={data.overdue}
        icon={<AlarmClock />}
        accent={data.overdue > 0 ? "red" : "emerald"}
        description="SLA estourado"
      />
      <Can perform="metrics:view">
        <SlaComplianceCard />
      </Can>
    </div>
  );
}
