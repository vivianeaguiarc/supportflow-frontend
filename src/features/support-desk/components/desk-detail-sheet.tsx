"use client";

import { ExternalLink, UserCheck } from "lucide-react";
import Link from "next/link";

import { Can } from "@/components/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataField } from "@/components/ui/data-field";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CommentTimeline } from "@/features/comments";
import {
  TicketActions,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import { useAssignTicket } from "@/features/tickets/hooks";
import { useAuth } from "@/hooks/use-auth";
import type { Ticket } from "@/types/ticket";

import { DeskSlaChip } from "./desk-sla-chip";

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

interface DeskDetailSheetProps {
  ticket: Ticket | null;
  onOpenChange: (open: boolean) => void;
}

function DeskDetailContent({ ticket }: { ticket: Ticket }) {
  const { user } = useAuth();
  const assignTicket = useAssignTicket();

  const isMine = Boolean(user?.id) && ticket.assignedToId === user?.id;

  function handleAssignToMe() {
    if (!user?.id || isMine) return;
    assignTicket.mutate({ id: ticket.id, agentId: user.id });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <TicketStatusBadge status={ticket.status} />
        <TicketPriorityBadge priority={ticket.priority} />
        <DeskSlaChip ticket={ticket} />
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-3">
        <DataField
          label="Protocolo"
          value={<span className="font-mono text-xs">{ticket.protocol}</span>}
        />
        <DataField
          label="Prazo de SLA"
          value={formatDateTime(ticket.slaDueAt)}
        />
        <DataField
          label="Responsável"
          value={
            ticket.assignedToId ? (
              <span className="font-mono text-xs break-all">
                {ticket.assignedToId}
              </span>
            ) : undefined
          }
          fallback="Sem responsável"
        />
        <DataField label="Aberto em" value={formatDateTime(ticket.createdAt)} />
      </div>

      {ticket.description ? (
        <p className="text-sm leading-6 whitespace-pre-line text-foreground">
          {ticket.description}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/tickets/${ticket.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLink className="size-4" />
          Abrir detalhe
        </Link>
        <Can perform="tickets:assign">
          <Button
            type="button"
            size="sm"
            onClick={handleAssignToMe}
            disabled={isMine || assignTicket.isPending || !user?.id}
          >
            <UserCheck className="size-4" />
            {isMine
              ? "Já é seu"
              : assignTicket.isPending
                ? "Assumindo..."
                : "Assumir para mim"}
          </Button>
        </Can>
      </div>

      <TicketActions ticket={ticket} />

      <Can perform="tickets:view-internal-comments">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            Comentários internos
          </p>
          <CommentTimeline ticketId={ticket.id} />
        </div>
      </Can>
    </div>
  );
}

/**
 * Painel lateral de detalhe rápido da Mesa de Atendimento. Concentra as ações
 * do atendente (abrir detalhe, assumir, alterar status, atribuir e comentar)
 * reutilizando `TicketActions` e `CommentTimeline`, com o RBAC visual de cada
 * ação preservado.
 */
export function DeskDetailSheet({
  ticket,
  onOpenChange,
}: DeskDetailSheetProps) {
  return (
    <Sheet open={ticket !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="line-clamp-2">
            {ticket?.title ?? "Chamado"}
          </SheetTitle>
          <SheetDescription>
            Detalhe rápido e ações operacionais do chamado.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          {ticket ? <DeskDetailContent ticket={ticket} /> : null}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
