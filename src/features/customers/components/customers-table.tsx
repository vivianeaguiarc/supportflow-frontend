"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
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

import { useCustomers } from "../hooks";
import type { Customer } from "../types";

const SORT_BY_VALUES = ["name", "email", "createdAt"] as const;
type SortBy = (typeof SORT_BY_VALUES)[number];

const ACTIVE_OPTIONS: FilterSelectOption[] = [
  { value: "true", label: "Ativos" },
  { value: "false", label: "Inativos" },
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(value),
  );
}

// Colunas baseadas estritamente no contrato real `Customer`.
const customerColumns: ColumnDef<Customer, any>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    enableHiding: false,
    meta: { label: "Nome" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    enableSorting: true,
    meta: { label: "E-mail" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mail" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    enableSorting: false,
    meta: { label: "Telefone" },
    header: "Telefone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.phone ?? "—"}</span>
    ),
  },
  {
    accessorKey: "document",
    enableSorting: false,
    meta: { label: "Documento" },
    header: "Documento",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.document ?? "—"}
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
        <StatusBadge tone="success" label="Ativo" />
      ) : (
        <StatusBadge tone="neutral" label="Inativo" />
      ),
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    meta: { label: "Cadastrado em" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cadastrado em" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];

/** Tela de clientes — reutiliza o DataTable genérico (server-side). */
export function CustomersTable() {
  const router = useRouter();
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
    defaultSorting: [{ id: "createdAt", desc: true }],
  });

  const search = getFilter("search")?.trim() || undefined;
  const isActiveRaw = getFilter("isActive");
  const isActive =
    isActiveRaw === "true" ? true : isActiveRaw === "false" ? false : undefined;

  const sortColumn = sorting[0];
  const sortBy: SortBy = SORT_BY_VALUES.includes(sortColumn?.id as SortBy)
    ? (sortColumn.id as SortBy)
    : "createdAt";
  const sortOrder = sortColumn?.desc === false ? "asc" : "desc";

  const { data, isLoading, isError, error, isFetching, refetch } = useCustomers(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search,
      isActive,
      sortBy,
      sortOrder,
    },
  );

  const customers = data?.data ?? [];
  const hasActiveFilters = Boolean(search || isActive !== undefined);

  const table = useDataTable({
    data: customers,
    columns: customerColumns,
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    getRowId: (customer) => customer.id,
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
            placeholder="Buscar por nome ou e-mail..."
            containerClassName="w-64"
            aria-label="Buscar clientes"
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
            onRowClick={(customer) => router.push(`/customers/${customer.id}`)}
            emptyState={{
              title: hasActiveFilters
                ? "Nenhum cliente encontrado"
                : "Nenhum cliente cadastrado ainda",
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
