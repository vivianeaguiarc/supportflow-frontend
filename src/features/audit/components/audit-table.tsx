"use client";

import {
  Download,
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
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/utils";

import { useAuditIntegrity, useAuditLog } from "../hooks";
import { downloadAuditCsv } from "../lib/audit-csv";
import { auditService } from "../services";
import {
  AUDIT_LOG_SORT_FIELDS,
  type AuditLogSortField,
  type ListAuditLogsParams,
} from "../types";
import { auditColumns } from "./audit-columns";
import { AuditDetailsSheet } from "./audit-details-sheet";
import { AuditFilters } from "./audit-filters";

/** Converte uma data `YYYY-MM-DD` (input) para ISO no início/fim do dia. */
function toIsoStartOfDay(value?: string): string | undefined {
  return value ? new Date(`${value}T00:00:00`).toISOString() : undefined;
}
function toIsoEndOfDay(value?: string): string | undefined {
  return value ? new Date(`${value}T23:59:59.999`).toISOString() : undefined;
}

/** Botão + selo de verificação da integridade da cadeia imutável (sob demanda). */
function AuditIntegrityCheck() {
  const { data, isFetching, refetch } = useAuditIntegrity();

  return (
    <div className="flex items-center gap-2">
      {data ? (
        data.status === "INTACT" ? (
          <Badge variant="secondary" className="gap-1" title={data.message}>
            <ShieldCheck /> Íntegra ({data.totalLogs})
          </Badge>
        ) : data.status === "EMPTY" ? (
          <Badge variant="outline" className="gap-1" title={data.message}>
            <ShieldQuestion /> Vazia
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1" title={data.message}>
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
    sorting,
    setPagination,
    setSorting,
    getFilter,
    setFilters,
    resetAll,
  } = useDataTableUrlState({
    defaultPageSize: 20,
    defaultSorting: [{ id: "createdAt", desc: true }],
  });

  const userId = getFilter("userId")?.trim() || undefined;
  const entityId = getFilter("entityId")?.trim() || undefined;
  const action = getFilter("action") || undefined;
  const entity = getFilter("entity") || undefined;
  const search = getFilter("search")?.trim() || undefined;
  const createdFrom = getFilter("createdFrom") || undefined;
  const createdTo = getFilter("createdTo") || undefined;

  const sortColumn = sorting[0];
  const sortBy: AuditLogSortField = AUDIT_LOG_SORT_FIELDS.includes(
    sortColumn?.id as AuditLogSortField,
  )
    ? (sortColumn.id as AuditLogSortField)
    : "createdAt";
  const sortOrder = sortColumn?.desc === false ? "asc" : "desc";

  const params: ListAuditLogsParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    userId,
    entityId,
    action,
    entity,
    search,
    createdFrom: toIsoStartOfDay(createdFrom),
    createdTo: toIsoEndOfDay(createdTo),
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAuditLog(params);

  const entries = data?.data ?? [];
  const hasActiveFilters = Boolean(
    userId ||
    entityId ||
    action ||
    entity ||
    search ||
    createdFrom ||
    createdTo,
  );

  const [isExporting, setIsExporting] = useState(false);

  // Exporta TODOS os registros que correspondem aos filtros atuais (não só a
  // página visível): pagina o backend via `listAll` e gera o CSV no cliente.
  function handleExportCsv() {
    const exportParams: ListAuditLogsParams = {
      ...params,
      page: undefined,
      limit: undefined,
    };
    const exportPromise = auditService.listAll(exportParams).then((all) => {
      downloadAuditCsv(all);
      return all.length;
    });

    setIsExporting(true);
    void exportPromise.finally(() => setIsExporting(false));

    notify.promise(exportPromise, {
      loading: "Gerando CSV da auditoria…",
      success: (count) => `CSV exportado: ${count} registro(s).`,
      error: "Não foi possível exportar o CSV.",
    });
  }

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
    pageCount: data?.meta?.totalPages ?? -1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    getRowId: (entry) => entry.id,
    initialColumnVisibility: { organizationId: false },
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
              onClick={handleExportCsv}
              disabled={entries.length === 0 || isExporting}
              title="Exporta todos os registros que correspondem aos filtros atuais"
            >
              <Download className={cn(isExporting && "animate-pulse")} />
              Exportar CSV
            </Button>
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
          filters={{
            userId,
            entityId,
            action,
            entity,
            search,
            createdFrom,
            createdTo,
          }}
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
          {data?.meta ? (
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
