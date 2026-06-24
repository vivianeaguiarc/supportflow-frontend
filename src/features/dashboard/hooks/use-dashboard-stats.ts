import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";

export const DASHBOARD_OVERVIEW_QUERY_KEY = ["dashboard", "overview"] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_OVERVIEW_QUERY_KEY,
    queryFn: () => dashboardService.getOverview(),
  });
}
