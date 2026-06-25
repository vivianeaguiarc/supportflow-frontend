"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Inbox,
  Ticket as TicketIcon,
} from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardStat } from "@/components/ui/card-stat";
import { DataField } from "@/components/ui/data-field";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTicketSummary } from "@/features/tickets/hooks";
import { getErrorMessage } from "@/lib/api-error";

import { useCustomerFromCache } from "../hooks";
import { CustomerTicketsTable } from "./customer-tickets-table";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

interface CustomerDetailProps {
  customerId: string;
}

/**
 * Detalhe do cliente (master-detail). Informações vêm do cache da listagem
 * (não há `GET /customers/{id}`); indicadores e chamados usam endpoints reais
 * filtrados por `customerId`.
 */
export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const customer = useCustomerFromCache(customerId);
  const summary = useTicketSummary({ customerId });

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer?.name ?? "Detalhe do cliente"}
        description={customer?.email ?? customerId}
        actions={
          <Link
            href="/customers"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Voltar para clientes
          </Link>
        }
      />

      <PageSection title="Informações do cliente">
        <Card>
          <CardContent>
            {customer ? (
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DataField label="Nome" value={customer.name} />
                <DataField label="E-mail" value={customer.email} />
                <DataField
                  label="Telefone"
                  value={customer.phone}
                  fallback="—"
                />
                <DataField
                  label="Documento"
                  value={customer.document}
                  fallback="—"
                />
                <DataField
                  label="Situação"
                  value={
                    customer.isActive ? (
                      <StatusBadge tone="success" label="Ativo" />
                    ) : (
                      <StatusBadge tone="neutral" label="Inativo" />
                    )
                  }
                />
                <DataField
                  label="Cadastrado em"
                  value={formatDate(customer.createdAt)}
                />
                <DataField
                  label="ID"
                  value={
                    <span
                      className="font-mono text-xs break-all text-muted-foreground"
                      title={customerId}
                    >
                      {customerId}
                    </span>
                  }
                />
              </dl>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dados completos do cliente indisponíveis nesta visão (o
                  backend ainda não expõe{" "}
                  <code>GET /customers/&#123;id&#125;</code>). Abra esta página
                  a partir da listagem de clientes para ver todos os detalhes.
                </p>
                <DataField
                  label="ID do cliente"
                  value={
                    <span className="font-mono text-xs break-all text-muted-foreground">
                      {customerId}
                    </span>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Resumo e estatísticas">
        {summary.isLoading ? (
          <Card>
            <CardContent>
              <LoadingState label="Carregando indicadores..." />
            </CardContent>
          </Card>
        ) : summary.isError ? (
          <Card>
            <CardContent>
              <ErrorState
                title="Não foi possível carregar os indicadores"
                description={getErrorMessage(
                  summary.error,
                  "Tente novamente em instantes.",
                )}
                onRetry={() => summary.refetch()}
              />
            </CardContent>
          </Card>
        ) : summary.data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CardStat
              label="Total de chamados"
              value={summary.data.total}
              icon={<TicketIcon />}
            />
            <CardStat
              label="Abertos"
              value={summary.data.open}
              icon={<Inbox />}
            />
            <CardStat
              label="Em andamento"
              value={summary.data.inProgress}
              icon={<Clock />}
            />
            <CardStat
              label="Resolvidos"
              value={summary.data.resolved}
              icon={<CheckCircle2 />}
            />
          </div>
        ) : null}
      </PageSection>

      <PageSection title="Chamados do cliente">
        <CustomerTicketsTable customerId={customerId} />
      </PageSection>
    </div>
  );
}
