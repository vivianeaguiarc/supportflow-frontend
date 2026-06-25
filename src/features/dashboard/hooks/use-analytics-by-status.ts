import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";
import { dashboardKeys } from "./dashboard-keys";

/** Distribuição por status (`GET /analytics/tickets-by-status`). */
export function useAnalyticsByStatus() {
  return useQuery({
    queryKey: dashboardKeys.byStatus(),
    queryFn: () => dashboardService.getTicketsByStatus(),
  });
}
