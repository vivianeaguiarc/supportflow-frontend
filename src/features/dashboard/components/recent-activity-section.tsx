"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/components/ui/page-section";
import { useTickets } from "@/features/tickets/hooks";
import { cn } from "@/lib/utils";

import { DashboardTicketList } from "./dashboard-ticket-list";

/** Últimos chamados criados ou atualizados na operação. */
export function RecentActivitySection() {
  const query = useTickets({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 8,
  });

  return (
    <PageSection
      title="Atividade recente"
      description="Últimos chamados registrados na operação."
      actions={
        <Link
          href="/tickets"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Ver todos
        </Link>
      }
      density="compact"
    >
      <Card>
        <CardContent className="pt-6">
          <DashboardTicketList
            tickets={query.data?.data ?? []}
            isLoading={query.isLoading}
            isError={query.isError}
            error={query.error}
            onRetry={() => query.refetch()}
            emptyTitle="Sem movimentação"
            emptyDescription="Nenhum chamado registrado recentemente."
          />
        </CardContent>
      </Card>
    </PageSection>
  );
}
