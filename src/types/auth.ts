/**
 * Contratos de autenticação.
 * Fonte da verdade: OpenAPI do supportflow-backend
 * (`POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`).
 */
import type { UserRole } from "./user";

export type { UserRole } from "./user";

/** Body de `POST /auth/login`. */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Resposta de `POST /auth/login` e `POST /auth/refresh` (schema
 * `TokenPairResponse`). O backend retorna os tokens "crus", SEM envelope
 * `ApiSuccessResponse` e SEM objeto `user`.
 */
export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export type AuthTokens = TokenPairResponse;

/** Body de `POST /auth/refresh`. */
export interface RefreshRequest {
  refreshToken: string;
}

/** Body de `POST /auth/logout`. */
export interface LogoutRequest {
  refreshToken: string;
}

/** Resposta de `POST /auth/logout`. */
export interface LogoutResponse {
  message: string;
}

/**
 * Identidade do usuário autenticado, recuperada via `GET /auth/me` a partir do
 * JWT de acesso. Mesma forma do schema `User` do backend.
 *
 * PENDENTE DE CONFIRMAÇÃO: o endpoint `GET /auth/me` ainda não aparece no
 * Swagger publicado. O contrato abaixo segue o schema `User` existente; ajustar
 * caso o backend exponha campos diferentes.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

/** Resposta de `GET /auth/me`: o usuário autenticado. */
export type MeResponse = AuthUser;

/** Estado de sessão exposto pelo AuthProvider. */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
