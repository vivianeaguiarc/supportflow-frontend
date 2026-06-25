"use client";

import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataField } from "@/components/ui/data-field";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CommentsTimeline } from "@/features/comments";
import {
  TicketActions,
  TicketHistory,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import { useTicket } from "@/features/tickets/hooks";
import { getErrorMessage } from "@/lib/api-error";
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
  const { data: ticket, isLoading, isError, error, refetch } = useTicket(id);

  const isNotFound = error instanceof ApiError && error.status === 404;
  const overdue = ticket ? isOverdue(ticket) : false;

  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title={ticket?.protocol ?? "Detalhe do chamado"}
            description={ticket?.title ?? "Informações do chamado"}
            actions={
              <Link
                href="/tickets"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <ArrowLeft className="size-4" />
                Voltar para chamados
              </Link>
            }
          />

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
                  <ErrorState
                    title="Não foi possível carregar o chamado"
                    description={getErrorMessage(
                      error,
                      "Tente novamente em instantes.",
                    )}
                    onRetry={() => refetch()}
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
                      <DataField label="Protocolo" value={ticket.protocol} />
                      <DataField
                        label="Cliente"
                        value={
                          <div className="flex items-center gap-2">
                            <UserAvatar name={ticket.customerId} size="sm" />
                            <MonoId value={ticket.customerId} />
                          </div>
                        }
                      />
                      <DataField
                        label="Responsável"
                        fallback="Não atribuído"
                        value={
                          ticket.assignedToId ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar
                                name={ticket.assignedToId}
                                size="sm"
                              />
                              <MonoId value={ticket.assignedToId} />
                            </div>
                          ) : undefined
                        }
                      />
                      <DataField
                        label="Categoria"
                        value={
                          ticket.categoryId ? (
                            <MonoId value={ticket.categoryId} />
                          ) : undefined
                        }
                      />
                      <DataField
                        label="Criado em"
                        value={formatDate(ticket.createdAt)}
                      />
                      <DataField
                        label="Atualizado em"
                        value={formatDate(ticket.updatedAt)}
                      />
                      <DataField
                        label="Prazo SLA"
                        value={
                          <span
                            className={overdue ? "text-destructive" : undefined}
                          >
                            {formatDate(ticket.slaDueAt)}
                            {overdue ? " (vencido)" : ""}
                          </span>
                        }
                      />
                      {ticket.closedAt ? (
                        <DataField
                          label="Fechado em"
                          value={formatDate(ticket.closedAt)}
                        />
                      ) : null}
                    </dl>
                  </CardContent>
                </Card>

                <Can perform="comments:view">
                  <PageSection title="Comentários internos">
                    <CommentsTimeline ticketId={ticket.id} />
                  </PageSection>
                </Can>

                <PageSection title="Histórico">
                  <TicketHistory ticketId={ticket.id} />
                </PageSection>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
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

                <Can perform={["tickets:changeStatus", "tickets:assign"]}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Ações rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TicketActions ticket={ticket} />
                    </CardContent>
                  </Card>
                </Can>
              </div>
            </div>
          ) : null}
        </div>
      </PageContainer>
    </AppShell>
  );
}
