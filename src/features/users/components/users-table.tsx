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
import type { User, UserRole } from "@/types/user";

import { useUsers } from "../hooks";
import { USER_ROLE_LABELS } from "../types/user-types";
import { UserRoleBadge } from "./user-role-badge";

const SORT_BY_VALUES = ["name", "email", "role", "createdAt"] as const;
type SortBy = (typeof SORT_BY_VALUES)[number];

const ROLE_VALUES: UserRole[] = [
  "ADMIN",
  "SUPERVISOR",
  "AGENT",
  "CUSTOMER",
  "OMBUDSMAN",
];

const ROLE_OPTIONS: FilterSelectOption[] = ROLE_VALUES.map((role) => ({
  value: role,
  label: USER_ROLE_LABELS[role],
}));

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(value),
  );
}

// Colunas baseadas estritamente no contrato real `User`.
const userColumns: ColumnDef<User, any>[] = [
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
    accessorKey: "role",
    enableSorting: true,
    meta: { label: "Papel" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Papel" />
    ),
    cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
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

/** Tela de usuários (equipe) — reutiliza o DataTable genérico (server-side). */
export function UsersTable() {
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
  const roleRaw = getFilter("role");
  const role = ROLE_VALUES.includes(roleRaw as UserRole)
    ? (roleRaw as UserRole)
    : undefined;

  const sortColumn = sorting[0];
  const sortBy: SortBy = SORT_BY_VALUES.includes(sortColumn?.id as SortBy)
    ? (sortColumn.id as SortBy)
    : "createdAt";
  const sortOrder = sortColumn?.desc === false ? "asc" : "desc";

  const { data, isLoading, isError, error, isFetching, refetch } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    role,
    sortBy,
    sortOrder,
  });

  const users = data?.data ?? [];
  const hasActiveFilters = Boolean(search || role);

  const table = useDataTable({
    data: users,
    columns: userColumns,
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    getRowId: (user) => user.id,
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
            aria-label="Buscar usuários"
          />
          <Button type="submit" variant="outline" size="sm">
            Buscar
          </Button>
        </form>

        <FilterSelect
          aria-label="Filtrar por papel"
          className="w-44"
          placeholder="Todos os papéis"
          options={ROLE_OPTIONS}
          value={roleRaw ?? ""}
          onValueChange={(value) => setFilter("role", value || null)}
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
            onRowClick={(user) => router.push(`/users/${user.id}`)}
            emptyState={{
              title: hasActiveFilters
                ? "Nenhum usuário encontrado"
                : "Nenhum usuário cadastrado ainda",
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
