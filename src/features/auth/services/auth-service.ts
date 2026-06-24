import { httpClient } from "@/services/http-client";
import type { ApiSuccessResponse } from "@/types/api";

import type { LoginRequest, LoginResponse } from "../types";

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient<ApiSuccessResponse<LoginResponse>>(
      "/auth/login",
      {
        method: "POST",
        body: payload,
        auth: false,
      },
    );

    return response.data;
  },
};
