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

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

/** @deprecated Use AuthUser instead */
export type User = AuthUser;
