import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";

import type {
  ListSlaPoliciesParams,
  SlaPolicyListResult,
  SlaSummary,
} from "../types";

/**
 * Integração com os endpoints reais que compõem a Configuração de SLA, via BFF
 * (`local: true`), que injeta o Bearer a partir do cookie HttpOnly.
 *
 * Somente leitura: o backend não expõe gerenciamento (escrita) de SLA.
 */
export const slaService = {
  /**
   * `GET /tickets/sla` — resumo de SLA do tenant (envelope `ApiSuccessResponse`,
   * por isso desembrulhamos com `unwrap`).
   */
  async getSummary(): Promise<SlaSummary> {
    const response = await httpClient<SlaSummary>("/api/tickets/sla", {
      local: true,
    });
    return unwrap<SlaSummary>(response);
  },

  /**
   * `GET /ticket-categories` — políticas de SLA por categoria (paginado, com
   * `search`, `isActive`, ordenação por `name`/`createdAt`).
   */
  listPolicies(
    params: ListSlaPoliciesParams = {},
  ): Promise<SlaPolicyListResult> {
    return httpClient<SlaPolicyListResult>("/api/ticket-categories", {
      local: true,
      params: {
        search: params.search,
        isActive: params.isActive,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        page: params.page,
        limit: params.limit,
      },
    });
  },
};

export type SlaService = typeof slaService;
