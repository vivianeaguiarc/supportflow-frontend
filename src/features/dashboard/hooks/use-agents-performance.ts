import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";
import { dashboardKeys } from "./dashboard-keys";

/** Performance por agente (`GET /analytics/agents-performance`). */
export function useAgentsPerformance() {
  return useQuery({
    queryKey: dashboardKeys.agentsPerformance(),
    queryFn: () => dashboardService.getAgentsPerformance(),
  });
}
