/**
 * Contratos de autenticação.
 * Fonte da verdade: código do supportflow-backend (módulo `auth`):
 * `GET /auth/me`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`.
 */
import type { UserRole } from "./user";

export type { UserRole } from "./user";

/** Body de `POST /auth/login`. */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Conteúdo de `data` em `POST /auth/login` e `POST /auth/refresh` (schema
 * `TokenPairResponse`).
 *
 * O backend SEMPRE envelopa via `sendSuccess`, então o corpo HTTP real é
 * `ApiSuccessResponse<TokenPairResponse>` (`{ success, data, message }`). Não há
 * objeto `user` no login — o usuário é obtido via `GET /auth/me`.
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
 * JWT de acesso.
 *
 * Fonte da verdade: mapper `toAuthUser` do backend
 * (`modules/auth/mappers/to-auth-user.ts`), que retorna exatamente estes campos
 * (sem `password` ou metadados de segurança), envelopados em
 * `ApiSuccessResponse<AuthUser>`.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

/** Resposta de `GET /auth/me`: o usuário autenticado. */
export type MeResponse = AuthUser;

/** Estado de sessão exposto pelo AuthProvider. */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
