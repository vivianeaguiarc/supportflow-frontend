"use client";

import { AlertCircle, ArrowLeft, FileQuestion, History } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Separator } from "@/components/ui/separator";
import {
  TicketActions,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import { useAuth } from "@/hooks/use-auth";
import { useTicketDetails } from "@/hooks/use-ticket-details";
import { ApiError } from "@/types/api";
import type { Ticket } from "@/types/ticket";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isOverdue(ticket: Ticket): boolean {
  if (!ticket.slaDueAt) return false;
  if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") return false;
  return new Date(ticket.slaDueAt).getTime() < Date.now();
}

function MonoId({ value }: { value: string }) {
  return (
    <span
      className="font-mono text-xs break-all text-muted-foreground"
      title={value}
    >
      {value}
    </span>
  );
}

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const {
    data: ticket,
    isLoading,
    isError,
    error,
    refetch,
  } = useTicketDetails(id);

  // Permissão básica de UI: clientes não gerenciam o chamado.
  const canManage = Boolean(user && user.role !== "CUSTOMER");
  const isNotFound = error instanceof ApiError && error.status === 404;
  const overdue = ticket ? isOverdue(ticket) : false;

  return (
    <AppShell
      title={ticket?.protocol ?? "Detalhe do chamado"}
      description={ticket?.title ?? "Informações do chamado"}
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
          <CardContent>
            <LoadingState label="Carregando chamado..." />
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent>
            {isNotFound ? (
              <EmptyState
                icon={FileQuestion}
                title="Chamado não encontrado"
                description="O chamado não existe ou você não tem acesso a ele."
                action={
                  <Link
                    href="/tickets"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Voltar para a listagem
                  </Link>
                }
              />
            ) : (
              <EmptyState
                icon={AlertCircle}
                tone="destructive"
                title="Não foi possível carregar o chamado"
                description={
                  error instanceof ApiError
                    ? error.message
                    : "Tente novamente em instantes."
                }
                action={
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Tentar novamente
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      ) : ticket ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{ticket.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticket.description ? (
                  <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
                    {ticket.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sem descrição informada.
                  </p>
                )}

                <Separator />

                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Protocolo</dt>
                    <dd className="text-sm font-medium">{ticket.protocol}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Cliente</dt>
                    <dd className="text-sm font-medium">
                      <MonoId value={ticket.customerId} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Responsável
                    </dt>
                    <dd className="text-sm font-medium">
                      {ticket.assignedToId ? (
                        <MonoId value={ticket.assignedToId} />
                      ) : (
                        <span className="text-muted-foreground">
                          Não atribuído
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Categoria</dt>
                    <dd className="text-sm font-medium">
                      {ticket.categoryId ? (
                        <MonoId value={ticket.categoryId} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Criado em</dt>
                    <dd className="text-sm font-medium">
                      {formatDate(ticket.createdAt)}
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
                  <div>
                    <dt className="text-xs text-muted-foreground">Prazo SLA</dt>
                    <dd
                      className={
                        overdue
                          ? "text-sm font-medium text-destructive"
                          : "text-sm font-medium"
                      }
                    >
                      {formatDate(ticket.slaDueAt)}
                      {overdue ? " (vencido)" : ""}
                    </dd>
                  </div>
                  {ticket.closedAt ? (
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Fechado em
                      </dt>
                      <dd className="text-sm font-medium">
                        {formatDate(ticket.closedAt)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={History}
                  title="Histórico indisponível"
                  description="O histórico de eventos ainda não está integrado nesta tela."
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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

            {canManage ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ações</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketActions ticket={ticket} />
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
