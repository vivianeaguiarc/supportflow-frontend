"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

/**
 * Cabeçalho de coluna com ordenação. Quando a coluna não é ordenável, renderiza
 * apenas o título. A ordenação é server-side: clicar dispara `toggleSorting`,
 * que atualiza o estado controlado e, por consequência, a URL e o refetch.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
        sorted && "text-foreground",
        className,
      )}
      aria-label={`Ordenar por ${title}`}
    >
      {title}
      <Icon className="size-3.5" />
    </button>
  );
}
