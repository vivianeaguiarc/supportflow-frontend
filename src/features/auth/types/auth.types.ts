export interface User {
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
  refreshToken: string;
  user: User;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}
