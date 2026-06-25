"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import {
  DataTableColumnHeader,
  getSelectionColumn,
} from "@/components/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";

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

/**
 * Colunas da tabela de tickets. Apenas mapeiam o domínio para o DataTable
 * genérico — os ids das colunas ordenáveis coincidem com `sortBy` do backend
 * (`priority`, `slaDueAt`, `createdAt`) para a ordenação server-side funcionar.
 */
export const ticketColumns: ColumnDef<Ticket, any>[] = [
  getSelectionColumn<Ticket>(),
  {
    accessorKey: "title",
    enableSorting: false,
    enableHiding: false,
    meta: { label: "Título" },
    header: "Título",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <div className="max-w-xs">
          <Link
            href={`/tickets/${ticket.id}`}
            className="block truncate font-medium text-primary hover:underline"
          >
            {ticket.title}
          </Link>
          <span className="text-xs text-muted-foreground">
            {ticket.protocol}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    enableSorting: false,
    meta: { label: "Status" },
    header: "Status",
    cell: ({ row }) => <TicketStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    enableSorting: true,
    meta: { label: "Prioridade" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => <TicketPriorityBadge priority={row.original.priority} />,
  },
  {
    accessorKey: "customerId",
    enableSorting: false,
    meta: { label: "Cliente" },
    header: "Cliente",
    cell: ({ row }) => (
      <span
        className="font-mono text-xs text-muted-foreground"
        title={row.original.customerId}
      >
        {shortId(row.original.customerId)}
      </span>
    ),
  },
  {
    accessorKey: "assignedToId",
    enableSorting: false,
    meta: { label: "Responsável" },
    header: "Responsável",
    cell: ({ row }) => {
      const assignedToId = row.original.assignedToId;
      return assignedToId ? (
        <span
          className="font-mono text-xs text-muted-foreground"
          title={assignedToId}
        >
          {shortId(assignedToId)}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">Não atribuído</span>
      );
    },
  },
  {
    accessorKey: "slaDueAt",
    enableSorting: true,
    meta: { label: "SLA / Vencimento" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA / Vencimento" />
    ),
    cell: ({ row }) => (
      <span
        className={cn(
          "text-muted-foreground",
          isOverdue(row.original) && "font-medium text-destructive",
        )}
      >
        {formatDate(row.original.slaDueAt)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    meta: { label: "Criado em" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) => (
      <Link
        href={`/tickets/${row.original.id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        onClick={(event) => event.stopPropagation()}
      >
        Ver
      </Link>
    ),
  },
];
