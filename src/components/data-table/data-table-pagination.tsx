"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  /** Opções de tamanho de página; quando vazio, oculta o seletor. */
  pageSizeOptions?: number[];
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_PAGE_SIZES = [10, 20, 30, 50];

/** Controles de paginação (server-side) dirigidos pelo estado da tabela. */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  isLoading,
  className,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);
  const selectedCount = table.getSelectedRowModel().rows.length;
  const enableSelection = table.options.enableRowSelection !== false;

  const sizeOptions: FilterSelectOption[] = pageSizeOptions.map((size) => ({
    value: String(size),
    label: `${size} / página`,
  }));

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        {enableSelection ? (
          <>
            {selectedCount} de {table.getRowModel().rows.length} linha(s)
            selecionada(s).
          </>
        ) : (
          <>
            Página {pageIndex + 1} de {pageCount}
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        {pageSizeOptions.length > 0 ? (
          <FilterSelect
            aria-label="Linhas por página"
            className="w-36"
            options={sizeOptions}
            value={String(pageSize)}
            onValueChange={(value) =>
              table.setPagination({ pageIndex: 0, pageSize: Number(value) })
            }
            disabled={isLoading}
          />
        ) : null}

        <span className="hidden text-sm text-muted-foreground sm:inline">
          Página {pageIndex + 1} de {pageCount}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
