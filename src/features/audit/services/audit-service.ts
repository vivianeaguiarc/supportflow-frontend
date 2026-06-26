import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";

import type {
  AuditChainVerification,
  AuditLogEntry,
  AuditLogListResult,
  ListAuditLogsParams,
} from "../types";

/**
 * Camada de integração com os endpoints reais de auditoria (somente leitura —
 * a trilha é imutável/append-only no backend).
 *
 * As chamadas passam pelos route handlers BFF (`/api/audit/*`, `local: true`),
 * que injetam o Bearer a partir do cookie HttpOnly.
 */

/** Opções da coleta paginada usada pela exportação CSV (`listAll`). */
export interface ListAuditExportOptions {
  /** Tamanho de cada página buscada do backend (padrão 100). */
  pageSize?: number;
  /** Teto de registros acumulados (padrão 5000) — evita export ilimitado. */
  maxRecords?: number;
}

export const auditService = {
  /**
   * `GET /admin/audit-logs` — lista paginada (envelope padrão com `meta`).
   * Retorna a resposta completa (`data` + `meta`), como as demais listagens
   * server-side; o consumidor lê `data`/`meta` diretamente.
   */
  list(params: ListAuditLogsParams = {}): Promise<AuditLogListResult> {
    return httpClient<AuditLogListResult>("/api/audit/audit-logs", {
      local: true,
      params: {
        organizationId: params.organizationId,
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        search: params.search,
        createdFrom: params.createdFrom,
        createdTo: params.createdTo,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        page: params.page,
        limit: params.limit,
      },
    });
  },

  /**
   * Coleta todos os registros que satisfazem os filtros atuais paginando o
   * `list` (a trilha não expõe endpoint de export dedicado). Usado pela
   * exportação CSV para respeitar os filtros aplicados além da página visível.
   * Há um teto de segurança (`maxRecords`) para evitar downloads ilimitados.
   */
  async listAll(
    params: ListAuditLogsParams = {},
    { pageSize = 100, maxRecords = 5000 }: ListAuditExportOptions = {},
  ): Promise<AuditLogEntry[]> {
    const collected: AuditLogEntry[] = [];
    let page = 1;

    for (;;) {
      const result = await this.list({ ...params, page, limit: pageSize });
      collected.push(...result.data);

      const hasNextPage = result.meta?.hasNextPage ?? false;
      if (!hasNextPage || collected.length >= maxRecords) break;
      page += 1;
    }

    return collected.slice(0, maxRecords);
  },

  /** `GET /admin/audit-logs/verify` — verifica a integridade da cadeia. */
  async verifyChain(): Promise<AuditChainVerification> {
    const response = await httpClient<AuditChainVerification>(
      "/api/audit/audit-logs/verify",
      { local: true },
    );
    return unwrap<AuditChainVerification>(response);
  },
};

export type AuditService = typeof auditService;
