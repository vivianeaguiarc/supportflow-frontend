"use client";

import Link from "next/link";

import { Can } from "@/components/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/components/ui/page-section";
import { useDeskQueue } from "@/features/support-desk/hooks";
import { useSlaBreachedTickets } from "@/features/tickets/hooks";
import { cn } from "@/lib/utils";

import { useAnalyticsSla } from "../hooks";
import { DashboardTicketList } from "./dashboard-ticket-list";
import { formatNumber, formatPercent } from "./format";

function SlaRiskSummary() {
  const { data } = useAnalyticsSla();

  if (!data || data.total === 0) return null;

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Em risco
        </p>
        <p className="font-heading text-xl font-semibold text-foreground">
          {formatNumber(data.warning)}
        </p>
      </div>
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-destructive uppercase">
          Violados
        </p>
        <p className="font-heading text-xl font-semibold text-destructive">
          {formatNumber(data.breached)}
        </p>
      </div>
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Conformidade
        </p>
        <p className="font-heading text-xl font-semibold text-foreground">
          {formatPercent(data.slaComplianceRate)}
        </p>
      </div>
    </div>
  );
}

function DueSoonList() {
  const queue = useDeskQueue("dueSoon", undefined);

  return (
    <DashboardTicketList
      tickets={queue.tickets.slice(0, 6)}
      isLoading={queue.isLoading}
      isError={queue.isError}
      error={queue.error}
      onRetry={() => queue.refetch()}
      emptyTitle="SLA sob controle"
      emptyDescription="Nenhum chamado ativo vence nas próximas 24 horas."
    />
  );
}

function BreachedPreview() {
  const query = useSlaBreachedTickets({ limit: 5 });

  return (
    <DashboardTicketList
      tickets={query.data?.data ?? []}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      onRetry={() => query.refetch()}
      emptyTitle="Nenhum SLA violado"
      emptyDescription="Todos os prazos ativos estão dentro do acordado."
      footer={
        (query.data?.meta.total ?? 0) > 0 ? (
          <div className="pt-3">
            <Link
              href="/support-desk"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Ver todos com SLA violado
            </Link>
          </div>
        ) : null
      }
    />
  );
}

/** Chamados com SLA próximo do vencimento ou já violado. */
export function SlaAtRiskSection() {
  return (
    <PageSection
      title="SLA em risco"
      description="Monitore prazos críticos antes que virem violação."
      density="compact"
    >
      <Can perform="analytics:view">
        <SlaRiskSummary />
      </Can>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">
              Próximos do vencimento
            </h3>
            <DueSoonList />
          </CardContent>
        </Card>

        <Can perform="metrics:view">
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-heading text-sm font-semibold text-destructive">
                SLA violado
              </h3>
              <BreachedPreview />
            </CardContent>
          </Card>
        </Can>
      </div>
    </PageSection>
  );
}
