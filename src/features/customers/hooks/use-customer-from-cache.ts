import { useQueryClient } from "@tanstack/react-query";

import type { ApiPaginatedResponse } from "@/types/api";

import type { Customer } from "../types";
import { customersKeys } from "./customers-keys";

/**
 * Recupera um cliente do cache do React Query (preenchido por `/customers`).
 *
 * ⚠️ Limitação do backend: **não existe `GET /customers/{id}`**. Enquanto esse
 * endpoint não for criado, o detalhe do cliente reaproveita o que já foi
 * carregado na listagem. Em acesso direto por URL (sem passar pela lista) o
 * cache pode estar vazio e o retorno será `undefined` — a UI degrada com
 * elegância, exibindo apenas o ID.
 *
 * TODO(backend): expor `GET /customers/{id}` para detalhe confiável e
 * deep-linkável.
 */
export function useCustomerFromCache(id: string): Customer | undefined {
  const queryClient = useQueryClient();

  const entries = queryClient.getQueriesData<ApiPaginatedResponse<Customer>>({
    queryKey: customersKeys.lists(),
  });

  for (const [, page] of entries) {
    const found = page?.data.find((customer) => customer.id === id);
    if (found) return found;
  }

  return undefined;
}
