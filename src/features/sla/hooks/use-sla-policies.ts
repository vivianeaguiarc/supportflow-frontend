import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { slaService } from "../services";
import type { ListSlaPoliciesParams } from "../types";
import { slaKeys } from "./sla-keys";

/**
 * Lista paginada de políticas de SLA por categoria (`GET /ticket-categories`).
 * `keepPreviousData` evita "piscar" o loading ao paginar/filtrar/ordenar.
 */
export function useSlaPolicies(params: ListSlaPoliciesParams = {}) {
  return useQuery({
    queryKey: slaKeys.policiesList(params),
    queryFn: () => slaService.listPolicies(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
