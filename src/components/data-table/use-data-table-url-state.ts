"use client";

import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export interface UseDataTableUrlStateOptions {
  /** Tamanho de página padrão (omitido da URL quando igual). */
  defaultPageSize?: number;
  /** Ordenação inicial (única coluna p/ ordenação server-side). */
  defaultSorting?: SortingState;
  /** Chaves de query usadas (permite múltiplas tabelas sem conflito). */
  keys?: {
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export interface DataTableUrlState {
  pagination: PaginationState;
  sorting: SortingState;
  setPagination: OnChangeFn<PaginationState>;
  setSorting: OnChangeFn<SortingState>;
  /** Lê o valor cru de um filtro server-side da URL. */
  getFilter: (key: string) => string | undefined;
  /** Define um filtro (volta para a primeira página). */
  setFilter: (key: string, value: string | null | undefined) => void;
  /** Define vários filtros de uma vez (volta para a primeira página). */
  setFilters: (updates: Record<string, string | null | undefined>) => void;
  /** Remove todos os parâmetros da URL. */
  resetAll: () => void;
  searchParams: URLSearchParams;
}

/**
 * Sincroniza estado de tabela (paginação, ordenação e filtros) com os
 * `searchParams` do Next.js. É a *fonte da verdade* da URL: links/refresh/voltar
 * do navegador reproduzem exatamente a mesma visão. Totalmente genérico — não
 * conhece nenhum domínio específico.
 */
export function useDataTableUrlState(
  options: UseDataTableUrlStateOptions = {},
): DataTableUrlState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultPageSize = options.defaultPageSize ?? 10;
  const keys = {
    page: options.keys?.page ?? "page",
    pageSize: options.keys?.pageSize ?? "pageSize",
    sortBy: options.keys?.sortBy ?? "sortBy",
    sortOrder: options.keys?.sortOrder ?? "sortOrder",
  };

  const pageRaw = Number(searchParams.get(keys.page));
  const pageIndex = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw - 1 : 0;
  const pageSizeRaw = Number(searchParams.get(keys.pageSize));
  const pageSize =
    Number.isInteger(pageSizeRaw) && pageSizeRaw > 0
      ? pageSizeRaw
      : defaultPageSize;
  const pagination = React.useMemo<PaginationState>(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const defaultSort = options.defaultSorting?.[0];
  const sortById = searchParams.get(keys.sortBy) ?? defaultSort?.id;
  const sortOrderParam = searchParams.get(keys.sortOrder);
  const sorting = React.useMemo<SortingState>(() => {
    if (!sortById) return options.defaultSorting ?? [];
    const desc = sortOrderParam
      ? sortOrderParam === "desc"
      : (defaultSort?.desc ?? true);
    return [{ id: sortById, desc }];
    // options.defaultSorting é estável o suficiente para o caso de uso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortById, sortOrderParam]);

  const commit = React.useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const queryString = next.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  const setPagination = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      commit((params) => {
        if (next.pageIndex <= 0) params.delete(keys.page);
        else params.set(keys.page, String(next.pageIndex + 1));

        if (next.pageSize === defaultPageSize) params.delete(keys.pageSize);
        else params.set(keys.pageSize, String(next.pageSize));
      });
    },
    [commit, pagination, defaultPageSize, keys.page, keys.pageSize],
  );

  const setSorting = React.useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0];
      commit((params) => {
        params.delete(keys.page);
        if (!first) {
          params.delete(keys.sortBy);
          params.delete(keys.sortOrder);
        } else {
          params.set(keys.sortBy, first.id);
          params.set(keys.sortOrder, first.desc ? "desc" : "asc");
        }
      });
    },
    [commit, sorting, keys.page, keys.sortBy, keys.sortOrder],
  );

  const setFilters = React.useCallback(
    (updates: Record<string, string | null | undefined>) => {
      commit((params) => {
        params.delete(keys.page);
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === undefined || value === "") {
            params.delete(key);
          } else {
            params.set(key, value);
          }
        }
      });
    },
    [commit, keys.page],
  );

  const setFilter = React.useCallback(
    (key: string, value: string | null | undefined) => {
      setFilters({ [key]: value });
    },
    [setFilters],
  );

  const getFilter = React.useCallback(
    (key: string) => searchParams.get(key) ?? undefined,
    [searchParams],
  );

  const resetAll = React.useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    pagination,
    sorting,
    setPagination,
    setSorting,
    getFilter,
    setFilter,
    setFilters,
    resetAll,
    searchParams,
  };
}
