import { httpClient } from "@/services/http-client";
import type { ApiSuccessResponse } from "@/types/api";

import type { AuthUser, LoginRequest, LoginResponse } from "../types";

export const authService = {
  async login(payload: LoginRequest): Promise<AuthUser> {
    const response = await httpClient<ApiSuccessResponse<LoginResponse>>(
      "/api/auth/login",
      {
        method: "POST",
        body: payload,
        local: true,
        skipAuthRefresh: true,
      },
    );

    return response.data.user;
  },
};
