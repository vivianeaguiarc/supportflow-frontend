"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { PanelRightOpen, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
  useDataTableUrlState,
} from "@/components/data-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BreachedSlaTicket } from "@/types/ticket";

import { useSlaBreachedTickets } from "../hooks";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

/** Formata as horas de atraso do contrato (`hoursOverdue`) em algo legível. */
function formatHoursOverdue(hours: number): string {
  if (hours <= 0) return "menos de 1h";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const remaining = hours % 24;
  return remaining > 0 ? `${days}d ${remaining}h` : `${days}d`;
}

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

interface CreateColumnsOptions {
  /** Abre o painel lateral de detalhe rápido (ações: assumir/status/comentar). */
  onOpenTicket?: (ticket: BreachedSlaTicket) => void;
}

/**
 * Colunas da tabela de SLA violado. O endpoint não suporta ordenação, então
 * todas as colunas têm `enableSorting: false`. Reaproveita os badges de
 * status/prioridade e o padrão de exibição de IDs das demais tabelas de tickets
 * (sem inventar campos: cliente/responsável vêm como IDs do contrato `Ticket`).
 */
function createBreachedColumns({
  onOpenTicket,
}: CreateColumnsOptions): ColumnDef<BreachedSlaTicket, any>[] {
  return [
    {
      accessorKey: "title",
      enableSorting: false,
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
      accessorKey: "priority",
      enableSorting: false,
      meta: { label: "Prioridade" },
      header: "Prioridade",
      cell: ({ row }) => (
        <TicketPriorityBadge priority={row.original.priority} />
      ),
    },
    {
      accessorKey: "status",
      enableSorting: false,
      meta: { label: "Status" },
      header: "Status",
      cell: ({ row }) => <TicketStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "slaDueAt",
      enableSorting: false,
      meta: { label: "SLA vencido em" },
      header: "SLA vencido em",
      cell: ({ row }) => (
        <span className="font-medium text-destructive">
          {formatDate(row.original.slaDueAt)}
        </span>
      ),
    },
    {
      accessorKey: "hoursOverdue",
      enableSorting: false,
      meta: { label: "Tempo de atraso" },
      header: "Tempo de atraso",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tone-danger">
          {formatHoursOverdue(row.original.hoursOverdue)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      enableSorting: false,
      meta: { label: "Criado em" },
      header: "Criado em",
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
        <div className="flex items-center gap-1">
          {onOpenTicket ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onOpenTicket(row.original);
              }}
            >
              <PanelRightOpen className="size-4" />
              Painel
            </Button>
          ) : null}
          <Link
            href={`/tickets/${row.original.id}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            onClick={(event) => event.stopPropagation()}
          >
            Ver
          </Link>
        </div>
      ),
    },
  ];
}

interface SlaBreachedTicketsTableProps {
  /**
   * Quando fornecido, exibe uma ação "Painel" que abre o detalhe rápido com as
   * ações operacionais (assumir, alterar status, comentar) — reusadas da mesa.
   */
  onOpenTicket?: (ticket: BreachedSlaTicket) => void;
}

/**
 * Tabela de chamados com SLA violado (`GET /tickets/sla/breached`). Reutiliza o
 * DataTable, a sincronização de paginação com a URL e os estados de
 * loading/erro/vazio/retry. Sem ordenação/filtros (não suportados pelo
 * endpoint real).
 */
export function SlaBreachedTicketsTable({
  onOpenTicket,
}: SlaBreachedTicketsTableProps) {
  const { pagination, setPagination } = useDataTableUrlState({
    defaultPageSize: 10,
    keys: { page: "slaPage", pageSize: "slaLimit" },
  });

  const { data, isLoading, isError, error, isFetching, refetch } =
    useSlaBreachedTickets({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    });

  const tickets = data?.data ?? [];

  const columns = useMemo(
    () => createBreachedColumns({ onOpenTicket }),
    [onOpenTicket],
  );

  const table = useDataTable({
    data: tickets,
    columns,
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    // O endpoint não suporta ordenação — estado controlado vazio + no-op.
    sorting: [],
    onSortingChange: () => {},
    getRowId: (ticket) => ticket.id,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn(isFetching && "animate-spin")} />
            Atualizar
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 py-4">
          <DataTable
            table={table}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            emptyState={{
              title: "Nenhum chamado com SLA violado",
              description:
                "Tudo dentro do prazo por aqui — nenhum chamado ativo ultrapassou o SLA.",
            }}
          />
          {data?.meta ? (
            <DataTablePagination table={table} isLoading={isFetching} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
