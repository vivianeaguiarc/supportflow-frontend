"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface TicketsPaginationProps {
  meta: PaginationMeta;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export function TicketsPagination({
  meta,
  isFetching,
  onPageChange,
}: TicketsPaginationProps) {
  const { page, totalPages, total, hasNextPage, hasPreviousPage } = meta;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-muted-foreground">
      <span>
        {total} resultado(s) • Página {page} de {Math.max(totalPages, 1)}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage || isFetching}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
