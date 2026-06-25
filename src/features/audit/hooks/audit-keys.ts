import type { ListAuditLogsParams } from "../types";

/**
 * Query keys centralizadas da feature de auditoria.
 * Hierarquia sob `["audit"]` permite invalidar tudo ou partes específicas.
 */
export const auditKeys = {
  all: ["audit"] as const,
  lists: () => [...auditKeys.all, "list"] as const,
  list: (params: ListAuditLogsParams) =>
    [...auditKeys.all, "list", params] as const,
  verify: () => [...auditKeys.all, "verify"] as const,
};
