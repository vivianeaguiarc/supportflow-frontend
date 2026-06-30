"use client";

import Link from "next/link";

import { DeskSlaChip } from "@/features/support-desk/components/desk-sla-chip";
import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import type { Ticket } from "@/types/ticket";

import { formatRelativeTime } from "./format";

interface DashboardTicketRowProps {
  ticket: Ticket;
}

/** Linha compacta de chamado para listas operacionais do dashboard. */
export function DashboardTicketRow({ ticket }: DashboardTicketRowProps) {
  return (
    <li className="border-b border-border py-3 last:border-0">
      <Link
        href={`/tickets/${ticket.id}`}
        className="group flex items-start justify-between gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="min-w-0 space-y-1.5">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
            {ticket.title}
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono">{ticket.protocol}</span>
            <span aria-hidden>·</span>
            <span>{formatRelativeTime(ticket.updatedAt)}</span>
          </p>
          <DeskSlaChip ticket={ticket} className="inline-flex" />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
        </div>
      </Link>
    </li>
  );
}
