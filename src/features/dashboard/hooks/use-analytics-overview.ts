import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";
import { dashboardKeys } from "./dashboard-keys";

/** Indicadores gerais (`GET /analytics/overview`). */
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardService.getOverview(),
  });
}
