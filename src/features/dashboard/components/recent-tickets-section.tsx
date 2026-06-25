"use client";

import Link from "next/link";

import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/features/tickets/components";
import { useTickets } from "@/features/tickets/hooks";

import { DashboardCard } from "./dashboard-card";
import { formatRelativeTime } from "./format";

export function RecentTicketsSection() {
  const { data, isLoading, isError, error, refetch } = useTickets({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 5,
  });

  const tickets = data?.data ?? [];

  return (
    <DashboardCard
      title="Chamados recentes"
      action={
        <Link
          href="/tickets"
          className="text-xs font-medium text-primary hover:underline"
        >
          Ver todos
        </Link>
      }
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={tickets.length === 0}
      emptyDescription="Nenhum chamado registrado ainda."
      onRetry={() => refetch()}
    >
      <ul className="divide-y divide-border">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="py-3 first:pt-0 last:pb-0">
            <Link
              href={`/tickets/${ticket.id}`}
              className="flex items-start justify-between gap-3 rounded-md transition-colors hover:text-primary"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {ticket.title}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{ticket.protocol}</span>
                  <span aria-hidden>·</span>
                  <span>{formatRelativeTime(ticket.createdAt)}</span>
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <TicketPriorityBadge priority={ticket.priority} />
                <TicketStatusBadge status={ticket.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
