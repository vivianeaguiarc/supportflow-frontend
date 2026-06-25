"use client";

import { RefreshCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

import { useTickets } from "../hooks";
import { TicketsFilters } from "./tickets-filters";
import { TicketsTable } from "./tickets-table";

const PAGE_SIZE = 10;
const STATUS_VALUES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
];
const PRIORITY_VALUES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const SORT_BY_VALUES = ["createdAt", "slaDueAt", "priority"] as const;

type SortBy = (typeof SORT_BY_VALUES)[number];
type SortOrder = "asc" | "desc";

type ParamValue = string | number | null | undefined;

function parseFilters(searchParams: URLSearchParams) {
  const pageRaw = Number(searchParams.get("page"));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const statusRaw = searchParams.get("status");
  const status = STATUS_VALUES.includes(statusRaw as TicketStatus)
    ? (statusRaw as TicketStatus)
    : undefined;

  const priorityRaw = searchParams.get("priority");
  const priority = PRIORITY_VALUES.includes(priorityRaw as TicketPriority)
    ? (priorityRaw as TicketPriority)
    : undefined;

  const search = searchParams.get("search")?.trim() || undefined;

  const sortByRaw = searchParams.get("sortBy");
  const sortBy = SORT_BY_VALUES.includes(sortByRaw as SortBy)
    ? (sortByRaw as SortBy)
    : "createdAt";

  const sortOrder: SortOrder =
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  return {
    page,
    limit: PAGE_SIZE,
    status,
    priority,
    search,
    sortBy,
    sortOrder,
  };
}

export function TicketsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = parseFilters(new URLSearchParams(searchParams.toString()));
  const { data, isLoading, isError, error, isFetching, refetch } =
    useTickets(filters);

  const setParams = useCallback(
    (updates: Record<string, ParamValue>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      if (resetPage) {
        next.delete("page");
      }

      const queryString = next.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [router, pathname, searchParams],
  );

  const handleToggleSort = useCallback(
    (column: SortBy) => {
      const sortOrder: SortOrder =
        filters.sortBy === column && filters.sortOrder === "asc"
          ? "desc"
          : "asc";
      setParams({ sortBy: column, sortOrder });
    },
    [filters.sortBy, filters.sortOrder, setParams],
  );

  const hasActiveFilters = Boolean(
    filters.status || filters.priority || filters.search,
  );

  const tickets = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TicketsFilters
          filters={{
            search: filters.search,
            status: filters.status,
            priority: filters.priority,
          }}
          hasActiveFilters={hasActiveFilters}
          onChange={(updates) =>
            setParams(updates as Record<string, ParamValue>)
          }
          onReset={() => router.push(pathname)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn(isFetching && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardContent className="py-4">
          {isLoading ? (
            <LoadingState label="Carregando chamados..." />
          ) : isError ? (
            <ErrorState
              title="Não foi possível carregar os chamados"
              description={getErrorMessage(
                error,
                "Tente novamente em instantes.",
              )}
              onRetry={() => refetch()}
            />
          ) : tickets.length === 0 ? (
            <EmptyState
              title={
                hasActiveFilters
                  ? "Nenhum chamado encontrado"
                  : "Nenhum chamado cadastrado ainda"
              }
              description={
                hasActiveFilters
                  ? "Ajuste ou limpe os filtros para ver mais resultados."
                  : undefined
              }
              action={
                hasActiveFilters ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(pathname)}
                  >
                    Limpar filtros
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              <TicketsTable
                tickets={tickets}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onToggleSort={handleToggleSort}
              />
              {data?.meta ? (
                <Pagination
                  page={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={(page) => setParams({ page }, false)}
                  isLoading={isFetching}
                />
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
