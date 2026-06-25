"use client";

import type { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /** Filtros/busca específicos da tela (lado esquerdo). */
  children?: ReactNode;
  /** Ações extras à direita, antes do menu de colunas. */
  actions?: ReactNode;
  /** Esconde o menu de visibilidade de colunas. */
  hideViewOptions?: boolean;
  className?: string;
}

/**
 * Barra de ferramentas da tabela: filtros à esquerda (via `children`), ações e
 * o menu de visibilidade de colunas à direita. Agnóstica de domínio.
 */
export function DataTableToolbar<TData>({
  table,
  children,
  actions,
  hideViewOptions,
  className,
}: DataTableToolbarProps<TData>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <div className="flex items-center gap-2">
        {actions}
        {hideViewOptions ? null : <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
