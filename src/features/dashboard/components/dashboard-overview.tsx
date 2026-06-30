"use client";

import { CheckCircle2, Clock, FileText, Inbox, Layers } from "lucide-react";

import { CardStat } from "@/components/ui/card-stat";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";

import { useAnalyticsOverview } from "../hooks";
import { formatNumber } from "./format";

export function OverviewSection() {
  const { data, isLoading, isError, refetch } = useAnalyticsOverview();

  if (isLoading) return <LoadingState />;
  if (isError)
    return (
      <ErrorState
        description="Não foi possível carregar os indicadores."
        onRetry={() => refetch()}
      />
    );
  if (!data) return null;
  if (data.totalTickets === 0)
    return (
      <EmptyState
        title="Sem chamados"
        description="Nenhum chamado registrado ainda."
      />
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <CardStat
        label="Total de chamados"
        value={formatNumber(data.totalTickets)}
        icon={<Layers />}
        accent="primary"
      />
      <CardStat
        label="Abertos"
        value={formatNumber(data.openTickets)}
        icon={<FileText />}
        accent="success"
      />
      <CardStat
        label="Em andamento"
        value={formatNumber(data.inProgressTickets)}
        icon={<Clock />}
        accent="warning"
      />
      <CardStat
        label="Resolvidos"
        value={formatNumber(data.resolvedTickets)}
        icon={<CheckCircle2 />}
        accent="info"
      />
      <CardStat
        label="Fechados"
        value={formatNumber(data.closedTickets)}
        icon={<Inbox />}
        accent="neutral"
      />
    </div>
  );
}
