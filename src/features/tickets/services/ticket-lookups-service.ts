import { httpClient } from "@/services/http-client";
import type { ApiPaginatedResponse } from "@/types/api";
import type { TicketCategory } from "@/types/ticket";
import type { Customer } from "@/types/user";

/**
 * Lookups auxiliares para o formulário de criação de chamado.
 *
 * Consomem os endpoints reais via BFF:
 * - `GET /customers` (RBAC: staff) → preenche o select de cliente.
 * - `GET /ticket-categories` → preenche o select de categoria.
 * Pedimos um `limit` alto para popular os selects em uma única chamada.
 */
export const ticketLookupsService = {
  async listCustomers(): Promise<Customer[]> {
    const response = await httpClient<ApiPaginatedResponse<Customer>>(
      "/api/customers",
      { local: true, params: { limit: 100, sortBy: "name", sortOrder: "asc" } },
    );
    return response.data;
  },

  async listCategories(): Promise<TicketCategory[]> {
    const response = await httpClient<ApiPaginatedResponse<TicketCategory>>(
      "/api/ticket-categories",
      { local: true, params: { limit: 100, isActive: true } },
    );
    return response.data;
  },
};
