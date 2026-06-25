import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";
import { dashboardKeys } from "./dashboard-keys";

/** CSAT — satisfação (`GET /analytics/csat`). */
export function useAnalyticsCsat() {
  return useQuery({
    queryKey: dashboardKeys.csat(),
    queryFn: () => dashboardService.getCsat(),
  });
}
