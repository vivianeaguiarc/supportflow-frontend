import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";
import { dashboardKeys } from "./dashboard-keys";

/** Indicadores de SLA (`GET /analytics/sla`). */
export function useAnalyticsSla() {
  return useQuery({
    queryKey: dashboardKeys.sla(),
    queryFn: () => dashboardService.getSla(),
  });
}
