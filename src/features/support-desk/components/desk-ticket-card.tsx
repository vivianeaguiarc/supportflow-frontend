"use client";

import { UserX } from "lucide-react";

import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

import { DeskSlaChip } from "./desk-sla-chip";

interface DeskTicketCardProps {
  ticket: Ticket;
  isActive: boolean;
  onSelect: (ticket: Ticket) => void;
}

/**
 * Cartão compacto de chamado para as filas operacionais. Densidade alta
 * (protocolo, título, badges, SLA) e seleção para abrir o painel lateral.
 */
export function DeskTicketCard({
  ticket,
  isActive,
  onSelect,
}: DeskTicketCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(ticket)}
      aria-pressed={isActive}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        isActive && "border-primary/60 bg-primary/5 ring-1 ring-primary/30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {ticket.title}
        </p>
        <TicketPriorityBadge priority={ticket.priority} />
      </div>

      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">{ticket.protocol}</span>
        {!ticket.assignedToId ? (
          <span className="inline-flex items-center gap-1 text-warning">
            <UserX className="size-3" aria-hidden />
            Sem responsável
          </span>
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <TicketStatusBadge status={ticket.status} />
        <DeskSlaChip ticket={ticket} />
      </div>
    </button>
  );
}
