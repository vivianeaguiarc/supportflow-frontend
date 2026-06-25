import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";
import { dashboardKeys } from "./dashboard-keys";

/** Distribuição por prioridade (`GET /analytics/tickets-by-priority`). */
export function useAnalyticsByPriority() {
  return useQuery({
    queryKey: dashboardKeys.byPriority(),
    queryFn: () => dashboardService.getTicketsByPriority(),
  });
}
