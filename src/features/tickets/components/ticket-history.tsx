"use client";

import { ArrowRight, History } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getErrorMessage } from "@/lib/api-error";
import type {
  TicketHistoryEntry,
  TicketHistoryEvent,
  TicketPriority,
  TicketStatus,
} from "@/types/ticket";

import { useTicketHistory } from "../hooks";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";

const EVENT_LABELS: Record<TicketHistoryEvent, string> = {
  CREATED: "Chamado criado",
  ASSIGNED: "Atribuído",
  REASSIGNED: "Reatribuído",
  STATUS_CHANGED: "Status alterado",
  PRIORITY_CHANGED: "Prioridade alterada",
  CATEGORY_CHANGED: "Categoria alterada",
  COMMENT_ADDED: "Comentário adicionado",
  ATTACHMENT_ADDED: "Anexo adicionado",
  ATTACHMENT_REMOVED: "Anexo removido",
  TICKET_ESCALATED: "Chamado escalado",
  SLA_BREACHED: "SLA violado",
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function shortenId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

/** Renderiza a transição de valor (status anterior → novo) conforme o evento. */
function ValueTransition({ entry }: { entry: TicketHistoryEntry }) {
  if (entry.action === "STATUS_CHANGED") {
    return (
      <span className="flex flex-wrap items-center gap-1.5">
        {entry.oldValue ? (
          <TicketStatusBadge status={entry.oldValue as TicketStatus} />
        ) : null}
        <ArrowRight className="size-3 text-muted-foreground" />
        {entry.newValue ? (
          <TicketStatusBadge status={entry.newValue as TicketStatus} />
        ) : null}
      </span>
    );
  }

  if (entry.action === "PRIORITY_CHANGED") {
    return (
      <span className="flex flex-wrap items-center gap-1.5">
        {entry.oldValue ? (
          <TicketPriorityBadge priority={entry.oldValue as TicketPriority} />
        ) : null}
        <ArrowRight className="size-3 text-muted-foreground" />
        {entry.newValue ? (
          <TicketPriorityBadge priority={entry.newValue as TicketPriority} />
        ) : null}
      </span>
    );
  }

  if (entry.oldValue ?? entry.newValue) {
    return (
      <span className="text-xs text-muted-foreground">
        {entry.oldValue ?? "—"} <ArrowRight className="inline size-3" />{" "}
        {entry.newValue ?? "—"}
      </span>
    );
  }

  return null;
}

interface TicketHistoryProps {
  ticketId: string;
}

/** Linha do tempo de auditoria do chamado (`GET /tickets/{id}/history`). */
export function TicketHistory({ ticketId }: TicketHistoryProps) {
  const { data, isLoading, isError, error, refetch } =
    useTicketHistory(ticketId);

  const entries = data ? [...data.history].reverse() : [];

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <LoadingState label="Carregando histórico..." />
        ) : isError ? (
          <ErrorState
            title="Não foi possível carregar o histórico"
            description={getErrorMessage(
              error,
              "Tente novamente em instantes.",
            )}
            onRetry={() => refetch()}
          />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={History}
            title="Sem eventos no histórico"
            description="As alterações do chamado aparecerão aqui."
          />
        ) : (
          <ol className="space-y-5">
            {entries.map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <UserAvatar name={entry.actorId ?? "Sistema"} size="sm" />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {EVENT_LABELS[entry.action]}
                    </span>
                    <ValueTransition entry={entry} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.actorId ? (
                      <span className="font-mono" title={entry.actorId}>
                        {shortenId(entry.actorId)}
                      </span>
                    ) : (
                      "Sistema"
                    )}{" "}
                    • {formatDateTime(entry.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
