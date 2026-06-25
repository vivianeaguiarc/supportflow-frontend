"use client";

import {
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";

import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
  useDataTableUrlState,
} from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useAuditIntegrity, useAuditLog } from "../hooks";
import type { ListAuditLogsParams } from "../types";
import { auditColumns } from "./audit-columns";
import { AuditDetailsSheet } from "./audit-details-sheet";
import { AuditFilters } from "./audit-filters";

/** Botão + selo de verificação da integridade da cadeia imutável (sob demanda). */
function AuditIntegrityCheck() {
  const { data, isFetching, refetch } = useAuditIntegrity();

  return (
    <div className="flex items-center gap-2">
      {data ? (
        data.status === "VALID" ? (
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck /> Íntegra ({data.totalVerified})
          </Badge>
        ) : data.status === "EMPTY" ? (
          <Badge variant="outline" className="gap-1">
            <ShieldQuestion /> Vazia
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <ShieldAlert /> Comprometida
          </Badge>
        )
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        disabled={isFetching}
      >
        <ShieldCheck className={cn(isFetching && "animate-pulse")} />
        Verificar integridade
      </Button>
    </div>
  );
}

export function AuditTable() {
  const {
    pagination,
    setPagination,
    setSorting,
    getFilter,
    setFilters,
    resetAll,
  } = useDataTableUrlState({ defaultPageSize: 20 });

  const userId = getFilter("userId")?.trim() || undefined;
  const entityId = getFilter("entityId")?.trim() || undefined;
  const action = getFilter("action") || undefined;
  const entity = getFilter("entity") || undefined;

  const params: ListAuditLogsParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    userId,
    entityId,
    action,
    entity,
  };

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAuditLog(params);

  const entries = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = data ? Math.max(Math.ceil(total / params.limit!), 1) : -1;
  const hasActiveFilters = Boolean(userId || entityId || action || entity);

  // Painel de detalhes (master-detail). O registro selecionado é derivado da
  // página atual: ao mudar filtros/página, se ele não estiver mais presente, o
  // painel fecha sozinho (sem efeitos colaterais).
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEntry = selectedId
    ? (entries.find((entry) => entry.id === selectedId) ?? null)
    : null;
  const activeEntryId = selectedEntry ? selectedId : null;

  const table = useDataTable({
    data: entries,
    columns: auditColumns,
    pageCount,
    pagination,
    onPaginationChange: setPagination,
    sorting: [],
    onSortingChange: setSorting,
    getRowId: (entry) => entry.id,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        actions={
          <>
            <AuditIntegrityCheck />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn(isFetching && "animate-spin")} />
              Atualizar
            </Button>
          </>
        }
      >
        <AuditFilters
          filters={{ userId, entityId, action, entity }}
          hasActiveFilters={hasActiveFilters}
          onChange={(updates) =>
            setFilters(updates as Record<string, string | null | undefined>)
          }
          onReset={resetAll}
        />
      </DataTableToolbar>

      <Card>
        <CardContent className="space-y-4 py-4">
          <DataTable
            table={table}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            onRowClick={(entry) => setSelectedId(entry.id)}
            emptyState={{
              title: hasActiveFilters
                ? "Nenhum registro encontrado"
                : "Nenhum registro de auditoria",
              description: hasActiveFilters
                ? "Ajuste ou limpe os filtros para ver mais resultados."
                : "As ações relevantes do sistema aparecerão aqui.",
              action: hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={resetAll}>
                  Limpar filtros
                </Button>
              ) : undefined,
            }}
          />
          {data && total > 0 ? (
            <DataTablePagination
              table={table}
              isLoading={isFetching}
              pageSizeOptions={[20, 50, 100]}
            />
          ) : null}
        </CardContent>
      </Card>

      <AuditDetailsSheet
        entryId={activeEntryId}
        params={params}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}
