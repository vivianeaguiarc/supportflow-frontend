import {
  type AuditLogEntry,
  getAuditActionLabel,
  getAuditEntityLabel,
} from "../types";

/** Colunas exportadas (ordem estável) e como extrair cada valor do registro. */
const CSV_COLUMNS: ReadonlyArray<{
  header: string;
  value: (entry: AuditLogEntry) => string;
}> = [
  { header: "sequence", value: (e) => e.sequence },
  { header: "createdAt", value: (e) => e.createdAt },
  { header: "action", value: (e) => e.action },
  { header: "actionLabel", value: (e) => getAuditActionLabel(e.action) },
  { header: "entity", value: (e) => e.entity },
  { header: "entityLabel", value: (e) => getAuditEntityLabel(e.entity) },
  { header: "entityId", value: (e) => e.entityId ?? "" },
  { header: "userId", value: (e) => e.userId ?? "" },
  { header: "ip", value: (e) => e.ip ?? "" },
  { header: "requestId", value: (e) => e.requestId ?? "" },
  { header: "organizationId", value: (e) => e.organizationId ?? "" },
  { header: "hash", value: (e) => e.hash },
  { header: "previousHash", value: (e) => e.previousHash ?? "" },
];

/** Escapa um campo para CSV (RFC 4180): aspas duplicadas + envolto em aspas. */
function escapeCsv(value: string): string {
  const needsQuotes = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

/** Monta o conteúdo CSV (com cabeçalho) a partir dos registros. */
export function buildAuditCsv(entries: AuditLogEntry[]): string {
  const header = CSV_COLUMNS.map((column) => column.header).join(",");
  const rows = entries.map((entry) =>
    CSV_COLUMNS.map((column) => escapeCsv(column.value(entry))).join(","),
  );
  return [header, ...rows].join("\r\n");
}

/**
 * Gera e baixa um arquivo CSV no navegador a partir dos registros fornecidos.
 * Prefixa um BOM para o Excel reconhecer UTF-8 (acentos). No-op fora do browser.
 */
export function downloadAuditCsv(
  entries: AuditLogEntry[],
  filename = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`,
): void {
  if (typeof window === "undefined") return;

  const csv = `\uFEFF${buildAuditCsv(entries)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
