"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

/** Controles genéricos de paginação (página atual + anterior/próxima). */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading,
  className,
}: PaginationProps) {
  const safeTotal = Math.max(totalPages, 1);
  const canPrevious = page > 1;
  const canNext = page < safeTotal;

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <p className="text-sm text-muted-foreground">
        Página {page} de {safeTotal}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrevious || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
