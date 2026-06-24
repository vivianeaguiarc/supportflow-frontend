/**
 * Contratos de usuários e clientes.
 * Fonte da verdade: OpenAPI do supportflow-backend (schemas `UserRole`,
 * `UserSummary`, `Customer` e respostas de `/users`).
 */

export type UserRole =
  | "ADMIN"
  | "SUPERVISOR"
  | "AGENT"
  | "CUSTOMER"
  | "OMBUDSMAN";

/** Usuário retornado por `GET /users` e `GET /users/{id}`. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
}

/** Forma resumida de usuário usada em referências (ex.: autor de comentário). */
export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

/** Cliente (schema `Customer`), retornado por `GET /customers`. */
export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Body de `POST /users`. */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Query params de `GET /users`. */
export interface ListUsersParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "email" | "createdAt" | "role";
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: UserRole;
  createdFrom?: string;
  createdTo?: string;
}
