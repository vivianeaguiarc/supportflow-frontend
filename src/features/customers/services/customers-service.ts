import { httpClient } from "@/services/http-client";
import type { ApiPaginatedResponse } from "@/types/api";

import type { Customer, ListCustomersParams } from "../types";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function toQueryParams(filters: ListCustomersParams): QueryParams {
  const { page, limit, search, sortBy, sortOrder, isActive } = filters;
  return { page, limit, search, sortBy, sortOrder, isActive };
}

/**
 * Integração com o endpoint real de clientes via BFF (`/api/customers`), que
 * injeta o cookie HttpOnly como Bearer ao falar com `GET /customers`.
 */
export const customersService = {
  /** `GET /customers` — resposta paginada (envelope + meta). */
  list(
    filters: ListCustomersParams = {},
  ): Promise<ApiPaginatedResponse<Customer>> {
    return httpClient<ApiPaginatedResponse<Customer>>("/api/customers", {
      local: true,
      params: toQueryParams(filters),
    });
  },
};

export type CustomersService = typeof customersService;
