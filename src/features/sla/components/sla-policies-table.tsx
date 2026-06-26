"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { type FormEvent } from "react";

import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
  useDataTableUrlState,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";

import { useSlaPolicies } from "../hooks";
import {
  SLA_POLICY_SORT_FIELDS,
  type SlaPolicy,
  type SlaPolicySortField,
} from "../types";

const ACTIVE_OPTIONS: FilterSelectOption[] = [
  { value: "true", label: "Ativas" },
  { value: "false", label: "Inativas" },
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(value),
  );
}

/** Converte horas de SLA em um rótulo legível (ex.: `72h` → `3d`). */
function formatSlaHours(hours: number | null): string {
  if (hours === null || hours === undefined) return "—";
  if (hours % 24 === 0) {
    const days = hours / 24;
    return `${hours}h (${days}d)`;
  }
  return `${hours}h`;
}

// Colunas baseadas estritamente no contrato real `TicketCategory`.
const slaPolicyColumns: ColumnDef<SlaPolicy, any>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    enableHiding: false,
    meta: { label: "Política (categoria)" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Política (categoria)" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    enableSorting: false,
    meta: { label: "Descrição" },
    header: "Descrição",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "slaHours",
    enableSorting: false,
    meta: { label: "Tempo de resolução" },
    header: "Tempo de resolução",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-foreground">
        {formatSlaHours(row.original.slaHours)}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    enableSorting: false,
    meta: { label: "Situação" },
    header: "Situação",
    cell: ({ row }) =>
      row.original.isActive ? (
        <StatusBadge tone="success" label="Ativa" />
      ) : (
        <StatusBadge tone="neutral" label="Inativa" />
      ),
  },
  {
    accessorKey: "tenantId",
    enableSorting: false,
    meta: { label: "Organização" },
    header: "Organização",
    cell: ({ row }) => (
      <span
        className="font-mono text-xs text-muted-foreground"
        title={row.original.tenantId}
      >
        {row.original.tenantId.slice(0, 8)}…
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    meta: { label: "Criada em" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criada em" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];

/**
 * Políticas de SLA por categoria — reutiliza o DataTable genérico (server-side).
 * Paginação, filtros (busca + situação) e ordenação (`name`/`createdAt`) são
 * todos suportados pelo endpoint real `GET /ticket-categories`.
 */
export function SlaPoliciesTable() {
  const {
    pagination,
    sorting,
    setPagination,
    setSorting,
    getFilter,
    setFilter,
    resetAll,
  } = useDataTableUrlState({
    defaultPageSize: 10,
    defaultSorting: [{ id: "name", desc: false }],
  });

  const search = getFilter("search")?.trim() || undefined;
  const isActiveRaw = getFilter("isActive");
  const isActive =
    isActiveRaw === "true" ? true : isActiveRaw === "false" ? false : undefined;

  const sortColumn = sorting[0];
  const sortBy: SlaPolicySortField = SLA_POLICY_SORT_FIELDS.includes(
    sortColumn?.id as SlaPolicySortField,
  )
    ? (sortColumn.id as SlaPolicySortField)
    : "name";
  const sortOrder = sortColumn?.desc ? "desc" : "asc";

  const { data, isLoading, isError, error, isFetching, refetch } =
    useSlaPolicies({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search,
      isActive,
      sortBy,
      sortOrder,
    });

  const policies = data?.data ?? [];
  const hasActiveFilters = Boolean(search || isActive !== undefined);

  const table = useDataTable({
    data: policies,
    columns: slaPolicyColumns,
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    getRowId: (policy) => policy.id,
  });

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("search") ?? "",
    ).trim();
    setFilter("search", value || null);
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table}>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <SearchInput
            key={search ?? ""}
            name="search"
            defaultValue={search ?? ""}
            placeholder="Buscar por categoria..."
            containerClassName="w-64"
            aria-label="Buscar políticas de SLA"
          />
          <Button type="submit" variant="outline" size="sm">
            Buscar
          </Button>
        </form>

        <FilterSelect
          aria-label="Filtrar por situação"
          className="w-44"
          placeholder="Todas as situações"
          options={ACTIVE_OPTIONS}
          value={isActiveRaw ?? ""}
          onValueChange={(value) => setFilter("isActive", value || null)}
        />

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={resetAll}>
            Limpar
          </Button>
        ) : null}
      </DataTableToolbar>

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
                ? "Nenhuma política encontrada"
                : "Nenhuma política de SLA cadastrada",
              description: hasActiveFilters
                ? "Ajuste ou limpe os filtros para ver mais resultados."
                : "As categorias de chamado com SLA aparecerão aqui.",
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
