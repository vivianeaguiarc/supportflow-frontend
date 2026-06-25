"use client";

import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

import { useTickets } from "../hooks";
import { TicketsFilters } from "./tickets-filters";
import { TicketsPagination } from "./tickets-pagination";
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
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
              <AlertCircle className="size-4 text-destructive" />
              {getErrorMessage(error, "Não foi possível carregar os chamados.")}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <Inbox className="size-6" />
              <p>
                {hasActiveFilters
                  ? "Nenhum chamado encontrado com os filtros atuais."
                  : "Nenhum chamado cadastrado ainda."}
              </p>
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(pathname)}
                >
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              <TicketsTable
                tickets={tickets}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onToggleSort={handleToggleSort}
              />
              {data?.meta ? (
                <TicketsPagination
                  meta={data.meta}
                  isFetching={isFetching}
                  onPageChange={(page) => setParams({ page }, false)}
                />
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
