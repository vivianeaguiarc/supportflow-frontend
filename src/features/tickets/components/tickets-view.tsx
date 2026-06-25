"use client";

import { RefreshCw } from "lucide-react";

import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
  useDataTableUrlState,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  ListTicketsParams,
  TicketPriority,
  TicketStatus,
} from "@/types/ticket";

import { useTickets } from "../hooks";
import { TicketsBulkActions } from "./tickets-bulk-actions";
import { ticketColumns } from "./tickets-columns";
import { TicketsFilters } from "./tickets-filters";

const STATUS_VALUES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
];
const PRIORITY_VALUES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const SORT_BY_VALUES = ["createdAt", "slaDueAt", "priority"] as const;
type SortBy = (typeof SORT_BY_VALUES)[number];

export function TicketsView() {
  const {
    pagination,
    sorting,
    setPagination,
    setSorting,
    getFilter,
    setFilters,
    resetAll,
  } = useDataTableUrlState({
    defaultPageSize: 10,
    defaultSorting: [{ id: "createdAt", desc: true }],
  });

  const statusRaw = getFilter("status");
  const status = STATUS_VALUES.includes(statusRaw as TicketStatus)
    ? (statusRaw as TicketStatus)
    : undefined;

  const priorityRaw = getFilter("priority");
  const priority = PRIORITY_VALUES.includes(priorityRaw as TicketPriority)
    ? (priorityRaw as TicketPriority)
    : undefined;

  const search = getFilter("search")?.trim() || undefined;

  const sortColumn = sorting[0];
  const sortBy: SortBy = SORT_BY_VALUES.includes(sortColumn?.id as SortBy)
    ? (sortColumn.id as SortBy)
    : "createdAt";
  const sortOrder = sortColumn?.desc === false ? "asc" : "desc";

  const filters: ListTicketsParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status,
    priority,
    search,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError, error, isFetching, refetch } =
    useTickets(filters);

  const tickets = data?.data ?? [];
  const hasActiveFilters = Boolean(status || priority || search);

  const table = useDataTable({
    data: tickets,
    columns: ticketColumns,
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    getRowId: (ticket) => ticket.id,
    enableRowSelection: true,
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
      >
        <TicketsFilters
          filters={{ search, status, priority }}
          hasActiveFilters={hasActiveFilters}
          onChange={(updates) =>
            setFilters(updates as Record<string, string | null | undefined>)
          }
          onReset={resetAll}
        />
      </DataTableToolbar>

      <TicketsBulkActions table={table} />

      <Card>
        <CardContent className="space-y-4 py-4">
          <DataTable
            table={table}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            emptyState={{
              title: hasActiveFilters
                ? "Nenhum chamado encontrado"
                : "Nenhum chamado cadastrado ainda",
              description: hasActiveFilters
                ? "Ajuste ou limpe os filtros para ver mais resultados."
                : undefined,
              action: hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={resetAll}>
                  Limpar filtros
                </Button>
              ) : undefined,
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
