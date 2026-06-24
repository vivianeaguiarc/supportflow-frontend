export interface AuthUser {
  id: string;
  email: string;
  name: string;
  tenantId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Resposta exposta ao cliente: nunca inclui tokens (ficam em cookies HttpOnly). */
export interface LoginResponse {
  user: AuthUser;
}

/** Tokens retornados pelo backend JWT, manipulados apenas no servidor (BFF). */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Payload do login vindo do backend, usado apenas nos route handlers. */
export interface BackendLoginData extends AuthTokens {
  user: AuthUser;
}

/** Payload do refresh vindo do backend, usado apenas nos route handlers. */
export interface BackendRefreshData {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}
