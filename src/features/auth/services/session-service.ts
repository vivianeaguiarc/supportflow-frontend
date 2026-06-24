import { httpClient } from "@/services/http-client";
import type { ApiSuccessResponse } from "@/types/api";
import { ApiError } from "@/types/api";

import type { AuthUser, LoginResponse } from "../types";

export const sessionService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await httpClient<ApiSuccessResponse<LoginResponse>>(
        "/api/auth/session",
        { local: true, skipAuthRefresh: true },
      );

      return response.data.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }

      throw error;
    }
  },

  async logout(): Promise<void> {
    await httpClient<void>("/api/auth/logout", {
      method: "POST",
      local: true,
      skipAuthRefresh: true,
    });
  },
};
