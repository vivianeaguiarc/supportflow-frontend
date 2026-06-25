import { useQuery } from "@tanstack/react-query";

import { ticketLookupsService } from "../services";
import { ticketsKeys } from "./tickets-keys";

/**
 * Lista de clientes para o select do formulário (`GET /customers`).
 * `enabled` permite não disparar a chamada para papéis sem acesso (ex.: o
 * próprio CUSTOMER, que usa o próprio id e não pode listar clientes).
 */
export function useCustomerOptions(enabled = true) {
  return useQuery({
    queryKey: ticketsKeys.customers(),
    queryFn: () => ticketLookupsService.listCustomers(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
