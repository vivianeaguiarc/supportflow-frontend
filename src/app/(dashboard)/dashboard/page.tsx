"use client";

import { AlertCircle } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTicketsSummary } from "@/features/tickets/hooks";
import { ApiError } from "@/types/api";

const summaryCards = [
  { key: "open", label: "Abertos" },
  { key: "inProgress", label: "Em andamento" },
  { key: "waitingCustomer", label: "Aguardando cliente" },
  { key: "overdue", label: "SLA vencido" },
] as const;

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useTicketsSummary();

  return (
    <AppShell
      title="Dashboard"
      description="Visão geral dos chamados e indicadores de atendimento."
    >
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.key}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
            <AlertCircle className="size-4 text-destructive" />
            {error instanceof ApiError
              ? error.message
              : "Não foi possível carregar o resumo."}
          </CardContent>
        </Card>
      ) : null}

      {data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-foreground">
                  {data[card.key]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
