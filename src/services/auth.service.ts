import { tokenStorage } from "@/lib/auth/token-storage";
import { httpClient } from "@/services/http-client";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  LoginCredentials,
  RefreshTokenPayload,
  TokenPair,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<TokenPair> {
    const response = await httpClient<ApiSuccessResponse<TokenPair>>(
      "/auth/login",
      {
        method: "POST",
        body: credentials,
        auth: false,
      },
    );

    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
    );

    return response.data;
  },

  async refresh(payload: RefreshTokenPayload): Promise<TokenPair> {
    const response = await httpClient<ApiSuccessResponse<TokenPair>>(
      "/auth/refresh",
      {
        method: "POST",
        body: payload,
        auth: false,
      },
    );

    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
    );

    return response.data;
  },

  logout(): void {
    tokenStorage.clearTokens();
  },

  isAuthenticated(): boolean {
    return tokenStorage.hasTokens();
  },
};
