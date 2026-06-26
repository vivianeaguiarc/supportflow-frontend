import type { ListSlaPoliciesParams } from "../types";

/**
 * Query keys centralizadas da feature de SLA.
 * Hierarquia sob `["sla"]` permite invalidar tudo ou partes específicas.
 */
export const slaKeys = {
  all: ["sla"] as const,
  summary: () => [...slaKeys.all, "summary"] as const,
  policies: () => [...slaKeys.all, "policies"] as const,
  policiesList: (params: ListSlaPoliciesParams) =>
    [...slaKeys.all, "policies", params] as const,
};
