import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { customersService } from "../services";
import type { ListCustomersParams } from "../types";
import { customersKeys } from "./customers-keys";

/** Lista paginada de clientes (`GET /customers`) com filtros do backend. */
export function useCustomers(filters: ListCustomersParams = {}) {
  return useQuery({
    queryKey: customersKeys.list(filters),
    queryFn: () => customersService.list(filters),
    placeholderData: keepPreviousData,
  });
}
