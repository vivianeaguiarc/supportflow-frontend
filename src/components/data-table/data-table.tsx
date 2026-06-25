"use client";

import {
  type ColumnDef,
  flexRender,
  type Table as TableInstance,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/ui/error-state";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

import { DataTableEmpty } from "./data-table-empty";
import { DataTableLoading } from "./data-table-loading";

export interface DataTableProps<TData> {
  table: TableInstance<TData>;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  /** Conteúdo do estado vazio. */
  emptyState?: {
    title?: string;
    description?: string;
    action?: ReactNode;
  };
  /** Callback ao clicar numa linha (torna a linha "clicável"). */
  onRowClick?: (row: TData) => void;
  /** Habilita redimensionamento (aplica larguras controladas). */
  enableColumnResizing?: boolean;
  className?: string;
}

/**
 * Tabela de dados genérica e tipada, construída sobre o TanStack Table.
 *
 * Apenas renderiza a instância `table` recebida (padrão de composição): toda a
 * lógica de paginação/ordenação/filtragem é server-side e mora no estado
 * controlado. Cobre loading, erro e vazio sem conhecer nenhum domínio.
 */
export function DataTable<TData>({
  table,
  isLoading,
  isError,
  error,
  onRetry,
  emptyState,
  onRowClick,
  enableColumnResizing,
  className,
}: DataTableProps<TData>) {
  const columnCount = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table
        className={cn("w-full text-sm", enableColumnResizing && "table-fixed")}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-border text-left text-muted-foreground"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={
                    enableColumnResizing
                      ? { width: header.getSize() }
                      : undefined
                  }
                  className={cn(
                    "relative px-3 pb-3 font-medium",
                    header.column.columnDef.meta?.headerClassName,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {enableColumnResizing && header.column.getCanResize() ? (
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        "absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none hover:bg-border",
                        header.column.getIsResizing() && "bg-primary",
                      )}
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {isError ? (
          <tbody>
            <tr>
              <td colSpan={columnCount} className="py-10">
                <ErrorState
                  title="Não foi possível carregar os dados"
                  description={getErrorMessage(
                    error,
                    "Tente novamente em instantes.",
                  )}
                  onRetry={onRetry}
                />
              </td>
            </tr>
          </tbody>
        ) : isLoading ? (
          <DataTableLoading columnCount={columnCount} />
        ) : rows.length === 0 ? (
          <DataTableEmpty
            columnCount={columnCount}
            title={emptyState?.title}
            description={emptyState?.description}
            action={emptyState?.action}
          />
        ) : (
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
                className={cn(
                  "border-b border-border/70 last:border-0 data-[state=selected]:bg-muted/50",
                  onRowClick && "cursor-pointer hover:bg-muted/40",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={
                      enableColumnResizing
                        ? { width: cell.column.getSize() }
                        : undefined
                    }
                    className={cn(
                      "px-3 py-3 align-middle",
                      cell.column.columnDef.meta?.cellClassName,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

/**
 * Coluna de seleção (checkbox) reutilizável. Inclua-a no início das colunas
 * quando a tabela precisar de seleção de linhas.
 */
export function getSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? undefined : false)
        }
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(Boolean(checked))
        }
        aria-label="Selecionar todas as linhas da página"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
        aria-label="Selecionar linha"
        // Evita disparar onRowClick ao marcar o checkbox.
        onClick={(event) => event.stopPropagation()}
      />
    ),
  };
}
