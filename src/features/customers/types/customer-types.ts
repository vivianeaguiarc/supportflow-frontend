import type { Customer } from "@/types/user";

export type { Customer };

/**
 * Query params de `GET /customers`.
 * Fonte da verdade: `list-customers-query.dto.ts` do backend
 * (page, limit, search, sortBy ∈ {name,email,createdAt}, sortOrder, isActive).
 */
export interface ListCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}
