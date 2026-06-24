import { httpClient } from "@/services/http-client";
import type { ApiSuccessResponse } from "@/types/api";

import type { DashboardOverview } from "../types";

export const dashboardService = {
  /**
   * Busca a visão geral do dashboard.
   *
   * A chamada vai para o route handler BFF (`/api/dashboard/overview`), que
   * injeta o token a partir do cookie HttpOnly e repassa para o backend
   * (`GET /analytics/overview`). O backend já entrega os indicadores
   * agregados, portanto não há derivação de métricas no frontend.
   */
  async getOverview(): Promise<DashboardOverview> {
    const response = await httpClient<ApiSuccessResponse<DashboardOverview>>(
      "/api/dashboard/overview",
      { local: true },
    );

    return response.data;
  },
};
