import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";

import type {
  AuditChainVerification,
  AuditLogListResult,
  ListAuditLogsParams,
} from "../types";

/**
 * Camada de integração com os endpoints reais de auditoria (somente leitura —
 * a trilha é imutável/append-only no backend).
 *
 * As chamadas passam pelos route handlers BFF (`/api/audit/*`, `local: true`),
 * que injetam o Bearer a partir do cookie HttpOnly. O backend envelopa as
 * respostas (`{ success, data, message }`), então usamos `unwrap()`.
 */
export const auditService = {
  /** `GET /admin/audit-logs` — lista paginada (mais recentes primeiro). */
  async list(params: ListAuditLogsParams = {}): Promise<AuditLogListResult> {
    const response = await httpClient<AuditLogListResult>(
      "/api/audit/audit-logs",
      {
        local: true,
        params: {
          organizationId: params.organizationId,
          userId: params.userId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          page: params.page,
          limit: params.limit,
        },
      },
    );
    return unwrap<AuditLogListResult>(response);
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
