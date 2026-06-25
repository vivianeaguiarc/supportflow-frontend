"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Table,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

export interface UseDataTableOptions<TData> {
  data: TData[];
  // ColumnDef precisa do segundo genérico aberto (valores heterogêneos por coluna).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  /** Total de páginas vindo do servidor (`meta.totalPages`). `-1` = desconhecido. */
  pageCount: number;
  /** Estado de paginação controlado (geralmente sincronizado com a URL). */
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  /** Estado de ordenação controlado (geralmente sincronizado com a URL). */
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  /** Identidade estável das linhas — essencial para seleção server-side. */
  getRowId?: (row: TData, index: number) => string;
  enableRowSelection?: boolean;
  initialColumnVisibility?: VisibilityState;
}

/**
 * Configura uma instância do TanStack Table em modo **controlado/server-side**.
 *
 * `manualPagination`/`manualSorting`/`manualFiltering` desativam os modelos
 * client-side: a tabela apenas reflete o estado e delega a busca de dados ao
 * servidor (via React Query no consumidor). Paginação e ordenação são
 * controladas de fora (URL); seleção e visibilidade de colunas vivem em estado
 * local por padrão.
 */
export function useDataTable<TData>({
  data,
  columns,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  getRowId,
  enableRowSelection = false,
  initialColumnVisibility,
}: UseDataTableOptions<TData>): Table<TData> {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility ?? {});

  return useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, sorting, rowSelection, columnVisibility },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection,
    enableSortingRemoval: false,
    columnResizeMode: "onChange",
    getRowId,
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });
}
