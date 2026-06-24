"use client";

import { AlertCircle, Inbox } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/types/api";

import { useDashboardStats } from "../hooks";
import type { DashboardOverview } from "../types";

interface CardConfig {
  key: keyof Pick<
    DashboardOverview,
    | "totalTickets"
    | "openTickets"
    | "inProgressTickets"
    | "resolvedTickets"
    | "closedTickets"
  >;
  label: string;
}

const COUNT_CARDS: CardConfig[] = [
  { key: "totalTickets", label: "Total de chamados" },
  { key: "openTickets", label: "Abertos" },
  { key: "inProgressTickets", label: "Em andamento" },
  { key: "resolvedTickets", label: "Resolvidos" },
  { key: "closedTickets", label: "Fechados" },
];

const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatPercent(value: number): string {
  return `${numberFormatter.format(Math.round(value * 10) / 10)}%`;
}

function formatHours(value: number): string {
  return `${numberFormatter.format(Math.round(value * 10) / 10)}h`;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {COUNT_CARDS.map((card) => (
        <Card key={card.key}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardStats() {
  const { data, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Não foi possível carregar os indicadores do dashboard.";

    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
          <AlertCircle className="size-4 text-destructive" />
          {message}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalTickets === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
          <Inbox className="size-6" />
          <p>Nenhum chamado registrado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {COUNT_CARDS.map((card) => (
          <Card key={card.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {formatNumber(data[card.key])}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SLA cumprido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {formatPercent(data.slaComplianceRate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo médio de resolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {formatHours(data.avgResolutionTimeHours)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SLA vencido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {formatNumber(data.slaBreachedTickets)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
