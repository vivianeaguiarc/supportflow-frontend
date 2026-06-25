"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ListTicketsParams, Ticket } from "@/types/ticket";

import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";

type SortBy = NonNullable<ListTicketsParams["sortBy"]>;
type SortOrder = NonNullable<ListTicketsParams["sortOrder"]>;

interface TicketsTableProps {
  tickets: Ticket[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  onToggleSort: (column: SortBy) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function isOverdue(ticket: Ticket): boolean {
  if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
    return false;
  }
  return new Date(ticket.slaDueAt).getTime() < Date.now();
}

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

interface SortableHeaderProps {
  column: SortBy;
  label: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onToggleSort: (column: SortBy) => void;
}

function SortableHeader({
  column,
  label,
  sortBy,
  sortOrder,
  onToggleSort,
}: SortableHeaderProps) {
  const active = sortBy === column;
  const Icon = active
    ? sortOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <th className="pb-3 pr-4 font-medium">
      <button
        type="button"
        onClick={() => onToggleSort(column)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </th>
  );
}

export function TicketsTable({
  tickets,
  sortBy,
  sortOrder,
  onToggleSort,
}: TicketsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-3 pr-4 font-medium">Título</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <SortableHeader
              column="priority"
              label="Prioridade"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onToggleSort={onToggleSort}
            />
            <th className="pb-3 pr-4 font-medium">Cliente</th>
            <th className="pb-3 pr-4 font-medium">Responsável</th>
            <SortableHeader
              column="slaDueAt"
              label="SLA / Vencimento"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onToggleSort={onToggleSort}
            />
            <SortableHeader
              column="createdAt"
              label="Criado em"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onToggleSort={onToggleSort}
            />
            <th className="pb-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-border/70 last:border-0"
            >
              <td className="max-w-xs py-3 pr-4">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="block truncate font-medium text-primary hover:underline"
                >
                  {ticket.title}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {ticket.protocol}
                </span>
              </td>
              <td className="py-3 pr-4">
                <TicketStatusBadge status={ticket.status} />
              </td>
              <td className="py-3 pr-4">
                <TicketPriorityBadge priority={ticket.priority} />
              </td>
              <td className="py-3 pr-4">
                <span
                  className="font-mono text-xs text-muted-foreground"
                  title={ticket.customerId}
                >
                  {shortId(ticket.customerId)}
                </span>
              </td>
              <td className="py-3 pr-4">
                {ticket.assignedToId ? (
                  <span
                    className="font-mono text-xs text-muted-foreground"
                    title={ticket.assignedToId}
                  >
                    {shortId(ticket.assignedToId)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Não atribuído
                  </span>
                )}
              </td>
              <td
                className={cn(
                  "py-3 pr-4 text-muted-foreground",
                  isOverdue(ticket) && "font-medium text-destructive",
                )}
              >
                {formatDate(ticket.slaDueAt)}
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {formatDate(ticket.createdAt)}
              </td>
              <td className="py-3">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
