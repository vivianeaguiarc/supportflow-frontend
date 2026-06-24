import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenPayload,
} from "../types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    void credentials;
    throw new Error("authService.login ainda não foi implementado.");
  },

  async refresh(payload: RefreshTokenPayload): Promise<LoginResponse> {
    void payload;
    throw new Error("authService.refresh ainda não foi implementado.");
  },

  logout(): void {
    // Será integrado com tokenStorage na próxima etapa.
  },

  isAuthenticated(): boolean {
    return false;
  },
};
