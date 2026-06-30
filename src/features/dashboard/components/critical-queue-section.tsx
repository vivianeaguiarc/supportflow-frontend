"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Can } from "@/components/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSection } from "@/components/ui/page-section";
import { useAuth } from "@/features/auth/hooks";
import { useTickets } from "@/features/tickets/hooks";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

import { DashboardTicketList } from "./dashboard-ticket-list";

function mergeUniqueTickets(...lists: Ticket[][]): Ticket[] {
  const seen = new Set<string>();
  const merged: Ticket[] = [];

  for (const list of lists) {
    for (const ticket of list) {
      if (seen.has(ticket.id)) continue;
      seen.add(ticket.id);
      merged.push(ticket);
    }
  }

  return merged;
}

/** Fila crítica para visão de equipe: urgentes, atrasados e sem responsável. */
function TeamCriticalQueue() {
  const urgent = useTickets({
    priority: "URGENT",
    limit: 5,
    sortBy: "slaDueAt",
    sortOrder: "asc",
  });
  const overdue = useTickets({
    overdue: true,
    limit: 5,
    sortBy: "slaDueAt",
    sortOrder: "asc",
  });
  const unassigned = useTickets({
    unassigned: true,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  const tickets = useMemo(
    () =>
      mergeUniqueTickets(
        overdue.data?.data ?? [],
        urgent.data?.data ?? [],
        unassigned.data?.data ?? [],
      ).slice(0, 8),
    [overdue.data, urgent.data, unassigned.data],
  );

  const isLoading =
    urgent.isLoading || overdue.isLoading || unassigned.isLoading;
  const isError = urgent.isError || overdue.isError || unassigned.isError;
  const error = urgent.error ?? overdue.error ?? unassigned.error;

  return (
    <DashboardTicketList
      tickets={tickets}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => {
        void urgent.refetch();
        void overdue.refetch();
        void unassigned.refetch();
      }}
      emptyTitle="Fila crítica tranquila"
      emptyDescription="Nenhum chamado urgente, atrasado ou sem responsável no momento."
      footer={
        <div className="pt-3">
          <Link
            href="/support-desk"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Abrir Mesa de Atendimento
          </Link>
        </div>
      }
    />
  );
}

/** Fila crítica do agente: seus chamados com maior risco operacional. */
function AgentCriticalQueue() {
  const { user } = useAuth();
  const query = useTickets({
    assignedToId: user?.id,
    limit: 20,
    sortBy: "slaDueAt",
    sortOrder: "asc",
  });

  const tickets = useMemo(() => {
    const list = query.data?.data ?? [];
    return list
      .filter(
        (ticket) =>
          ticket.priority === "URGENT" ||
          ticket.priority === "HIGH" ||
          ticket.status === "ESCALATED",
      )
      .slice(0, 8);
  }, [query.data]);

  return (
    <DashboardTicketList
      tickets={tickets}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      onRetry={() => query.refetch()}
      emptyTitle="Sem prioridades críticas"
      emptyDescription="Nenhum chamado urgente ou escalado atribuído a você."
      footer={
        <div className="pt-3">
          <Link
            href="/support-desk"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Ver minhas filas
          </Link>
        </div>
      }
    />
  );
}

/** Chamados que exigem ação imediata — prioridade, SLA ou fila parada. */
export function CriticalQueueSection() {
  return (
    <PageSection
      title="Fila crítica"
      description="Chamados que precisam de atenção imediata da equipe."
      density="compact"
    >
      <Card className="border-destructive/20 bg-destructive/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="size-4 text-destructive" aria-hidden />
            Prioridade operacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Can perform="analytics:view" fallback={<AgentCriticalQueue />}>
            <TeamCriticalQueue />
          </Can>
        </CardContent>
      </Card>
    </PageSection>
  );
}
