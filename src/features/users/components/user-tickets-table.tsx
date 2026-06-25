"use client";

import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
  useDataTableUrlState,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  ticketColumnsBase,
  TicketsFilters,
} from "@/features/tickets/components";
import { useTickets } from "@/features/tickets/hooks";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

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

interface UserTicketsTableProps {
  userId: string;
}

/**
 * Chamados atribuídos a um usuário — reutiliza o DataTable genérico e as colunas
 * de tickets, forçando o filtro server-side `assignedToId`. Paginação, ordenação,
 * filtros e navegação funcionam exatamente como em `/tickets`.
 */
export function UserTicketsTable({ userId }: UserTicketsTableProps) {
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

  const { data, isLoading, isError, error, isFetching, refetch } = useTickets({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    assignedToId: userId,
    status,
    priority,
    search,
    sortBy,
    sortOrder,
  });

  const tickets = data?.data ?? [];
  const hasActiveFilters = Boolean(status || priority || search);

  const table = useDataTable({
    data: tickets,
    columns: ticketColumnsBase,
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    getRowId: (ticket) => ticket.id,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table}>
        <TicketsFilters
          filters={{ search, status, priority }}
          hasActiveFilters={hasActiveFilters}
          onChange={(updates) =>
            setFilters(updates as Record<string, string | null | undefined>)
          }
          onReset={resetAll}
        />
      </DataTableToolbar>

      <DataTable
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        emptyState={{
          title: hasActiveFilters
            ? "Nenhum chamado encontrado"
            : "Este usuário não possui chamados atribuídos",
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
    </div>
  );
}
