"use client";

import Link from "next/link";

import { DataField } from "@/components/ui/data-field";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuditEntry } from "../hooks";
import {
  type AuditLogEntry,
  getAuditActionLabel,
  getAuditEntityLabel,
  type ListAuditLogsParams,
} from "../types";

interface AuditDetailsSheetProps {
  /** Id do registro selecionado; `null` mantém o painel fechado. */
  entryId: string | null;
  /** Mesmos params da listagem — garante o acerto no cache (sem request extra). */
  params: ListAuditLogsParams;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(value));
}

/** Bloco de JSON formatado para `oldValues`/`newValues`/`metadata`. */
function JsonBlock({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <pre className="max-h-64 overflow-auto rounded-lg bg-muted/60 p-3 font-mono text-xs whitespace-pre-wrap text-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function HashField({ label, value }: { label: string; value: string | null }) {
  return (
    <DataField
      label={label}
      value={
        value ? (
          <span className="font-mono text-xs break-all" title={value}>
            {value}
          </span>
        ) : undefined
      }
      fallback="—"
    />
  );
}

function AuditDetailsContent({ entry }: { entry: AuditLogEntry }) {
  const resource =
    entry.entityId && entry.entity === "ticket" ? (
      <Link
        href={`/tickets/${entry.entityId}`}
        className="font-mono text-xs text-primary hover:underline"
      >
        {entry.entityId}
      </Link>
    ) : (
      entry.entityId && (
        <span className="font-mono text-xs break-all">{entry.entityId}</span>
      )
    );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <DataField label="Ação" value={getAuditActionLabel(entry.action)} />
        <DataField label="Entidade" value={getAuditEntityLabel(entry.entity)} />
        <DataField label="Recurso" value={resource} />
        <DataField
          label="Usuário"
          value={
            entry.userId ? (
              <span className="font-mono text-xs break-all">
                {entry.userId}
              </span>
            ) : (
              <span className="text-muted-foreground italic">Sistema</span>
            )
          }
        />
        <DataField
          label="Tenant"
          value={
            entry.organizationId ? (
              <span className="font-mono text-xs break-all">
                {entry.organizationId}
              </span>
            ) : undefined
          }
        />
        <DataField label="Sequência" value={entry.sequence} />
        <DataField
          label="Data/hora"
          value={formatDateTime(entry.createdAt)}
          className="col-span-2"
        />
        <DataField
          label="Código da ação"
          value={<span className="font-mono text-xs">{entry.action}</span>}
        />
        <DataField
          label="ID do registro"
          value={
            <span className="font-mono text-xs break-all">{entry.id}</span>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-3">
        <p className="col-span-2 text-xs font-semibold text-foreground">
          Observabilidade
        </p>
        <DataField
          label="IP de origem"
          value={
            entry.ip ? (
              <span className="font-mono text-sm break-all">{entry.ip}</span>
            ) : undefined
          }
          fallback="Não coletado"
        />
        <DataField
          label="Request ID"
          value={
            entry.requestId ? (
              <span className="font-mono text-xs break-all">
                {entry.requestId}
              </span>
            ) : undefined
          }
          fallback="Não coletado"
        />
      </div>

      <JsonBlock label="Valores anteriores" value={entry.oldValues} />
      <JsonBlock label="Novos valores" value={entry.newValues} />
      <JsonBlock label="Metadados" value={entry.metadata} />

      <div className="space-y-3 rounded-lg border border-border p-3">
        <p className="text-xs font-semibold text-foreground">
          Integridade (cadeia imutável)
        </p>
        <HashField label="Hash" value={entry.hash} />
        <HashField label="Hash anterior" value={entry.previousHash} />
      </div>
    </div>
  );
}

/**
 * Painel lateral (Sheet) com os detalhes completos de um registro de auditoria
 * (master-detail). Lê o registro do cache da listagem via `useAuditEntry`.
 */
export function AuditDetailsSheet({
  entryId,
  params,
  onOpenChange,
}: AuditDetailsSheetProps) {
  const { data: entry, isLoading } = useAuditEntry(entryId, params);

  return (
    <Sheet open={entryId !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detalhes do registro</SheetTitle>
          <SheetDescription>
            Evento imutável da trilha de auditoria.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          {isLoading && !entry ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : entry ? (
            <AuditDetailsContent entry={entry} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Registro não encontrado nesta página.
            </p>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
