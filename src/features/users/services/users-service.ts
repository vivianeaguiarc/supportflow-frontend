import { httpClient } from "@/services/http-client";
import type { ApiPaginatedResponse } from "@/types/api";
import { unwrap } from "@/types/api";
import type { ListUsersParams, User } from "@/types/user";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function toQueryParams(filters: ListUsersParams): QueryParams {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    role,
    createdFrom,
    createdTo,
  } = filters;
  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    role,
    createdFrom,
    createdTo,
  };
}

/**
 * Integração com o endpoint real de usuários via BFF (`/api/users`), que injeta
 * o cookie HttpOnly como Bearer ao falar com `GET /users` (RBAC no backend).
 */
export const usersService = {
  /** `GET /users` — resposta paginada (envelope + meta). */
  list(filters: ListUsersParams = {}): Promise<ApiPaginatedResponse<User>> {
    return httpClient<ApiPaginatedResponse<User>>("/api/users", {
      local: true,
      params: toQueryParams(filters),
    });
  },

  /** `GET /users/{id}` — usuário individual (desembrulhado do envelope). */
  async getById(id: string): Promise<User> {
    const response = await httpClient<User>(
      `/api/users/${encodeURIComponent(id)}`,
      { local: true },
    );
    return unwrap<User>(response);
  },
};

export type UsersService = typeof usersService;
