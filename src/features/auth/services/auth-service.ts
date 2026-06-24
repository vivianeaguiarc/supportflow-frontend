import { httpClient } from "@/services/http-client";
import type { ApiSuccessResponse } from "@/types/api";
import { ApiError } from "@/types/api";

import type { AuthUser, LoginRequest } from "../types";

export const authService = {
  /**
   * Autentica o usuário via BFF. Os tokens são persistidos em cookies HttpOnly
   * pelo route handler; o usuário é recuperado depois com `getMe()`.
   */
  async login(payload: LoginRequest): Promise<void> {
    await httpClient<{ success: boolean }>("/api/auth/login", {
      method: "POST",
      body: payload,
      local: true,
      skipAuthRefresh: true,
    });
  },

  /**
   * Recupera o usuário autenticado via `GET /auth/me` (através do BFF).
   * Retorna `null` quando a sessão é inválida (401) após tentativa de refresh.
   */
  async getMe(): Promise<AuthUser | null> {
    try {
      const response = await httpClient<ApiSuccessResponse<AuthUser>>(
        "/api/auth/me",
        { local: true },
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }

      throw error;
    }
  },

  /** Encerra a sessão limpando os cookies HttpOnly via BFF. */
  async logout(): Promise<void> {
    await httpClient("/api/auth/logout", {
      method: "POST",
      local: true,
      skipAuthRefresh: true,
    });
  },
};
