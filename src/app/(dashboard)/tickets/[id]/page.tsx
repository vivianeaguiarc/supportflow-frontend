"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import { useTicket } from "@/features/tickets/hooks";
import { ApiError } from "@/types/api";

function formatDate(value: string | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const resolvedParams = use(params);
  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useTicket(resolvedParams.id);

  return (
    <AppShell
      title={ticket?.protocol ?? "Detalhe do chamado"}
      description={ticket?.title ?? "Carregando informações do chamado..."}
    >
      <div className="mb-4">
        <Link
          href="/tickets"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4" />
          Voltar para chamados
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
            <AlertCircle className="size-4 text-destructive" />
            {error instanceof ApiError
              ? error.message
              : "Não foi possível carregar o chamado."}
          </CardContent>
        </Card>
      ) : null}

      {ticket ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{ticket.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {ticket.description}
              </p>
              <Separator />
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Protocolo</dt>
                  <dd className="text-sm font-medium">{ticket.protocol}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Criado em</dt>
                  <dd className="text-sm font-medium">
                    {formatDate(ticket.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">SLA</dt>
                  <dd className="text-sm font-medium">
                    {formatDate(ticket.slaDueAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Atualizado em
                  </dt>
                  <dd className="text-sm font-medium">
                    {formatDate(ticket.updatedAt)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Prioridade
                </span>
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
