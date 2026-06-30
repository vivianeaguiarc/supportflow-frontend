"use client";

import Link from "next/link";

import { Can } from "@/components/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSection } from "@/components/ui/page-section";
import { useAuth } from "@/features/auth/hooks";
import { useTickets } from "@/features/tickets/hooks";
import { cn } from "@/lib/utils";

import { DashboardTicketList } from "./dashboard-ticket-list";

/** Chamados atribuídos ao agente logado. */
function AgentMyTickets() {
  const { user } = useAuth();
  const query = useTickets({
    assignedToId: user?.id,
    limit: 8,
    sortBy: "slaDueAt",
    sortOrder: "asc",
  });

  return (
    <DashboardTicketList
      tickets={query.data?.data ?? []}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      onRetry={() => query.refetch()}
      emptyTitle="Nenhum chamado atribuído"
      emptyDescription="Assuma chamados da fila sem responsável na Mesa de Atendimento."
      footer={
        <div className="pt-3">
          <Link
            href="/tickets"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Ver todos os chamados
          </Link>
        </div>
      }
    />
  );
}

/** Fila sem responsável — visível para gestores na visão de equipe. */
function TeamUnassignedQueue() {
  const query = useTickets({
    unassigned: true,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  return (
    <DashboardTicketList
      tickets={query.data?.data ?? []}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      onRetry={() => query.refetch()}
      emptyTitle="Fila atribuída"
      emptyDescription="Todos os chamados ativos já têm um responsável."
      footer={
        <div className="pt-3">
          <Link
            href="/support-desk"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Gerenciar filas
          </Link>
        </div>
      }
    />
  );
}

/**
 * Segunda coluna do dashboard: "Meus chamados" (agente) ou fila sem
 * responsável (gestores).
 */
export function MyTicketsSection() {
  return (
    <Can
      perform="analytics:view"
      fallback={
        <PageSection
          title="Meus chamados"
          description="Chamados atribuídos a você, ordenados pelo prazo de SLA."
          density="compact"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sua fila de trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentMyTickets />
            </CardContent>
          </Card>
        </PageSection>
      }
    >
      <PageSection
        title="Sem responsável"
        description="Chamados aguardando atribuição a um atendente."
        density="compact"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fila de triagem</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamUnassignedQueue />
          </CardContent>
        </Card>
      </PageSection>
    </Can>
  );
}
