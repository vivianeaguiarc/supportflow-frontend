import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";

import type {
  AnalyticsAgentsPerformance,
  AnalyticsCsat,
  AnalyticsSla,
  AnalyticsTicketsByPriority,
  AnalyticsTicketsByStatus,
  DashboardOverview,
} from "../types";

/**
 * Integração com os endpoints reais de analytics via BFF
 * (`/api/analytics/{metric}`), que injeta o Bearer do cookie HttpOnly. As
 * respostas são envelopadas pelo backend, então usamos `unwrap()`.
 */
async function fetchAnalytics<T>(metric: string): Promise<T> {
  const response = await httpClient<T>(`/api/analytics/${metric}`, {
    local: true,
  });
  return unwrap<T>(response);
}

export const dashboardService = {
  /** `GET /analytics/overview`. */
  getOverview: () => fetchAnalytics<DashboardOverview>("overview"),

  /** `GET /analytics/tickets-by-status`. */
  getTicketsByStatus: () =>
    fetchAnalytics<AnalyticsTicketsByStatus>("tickets-by-status"),

  /** `GET /analytics/tickets-by-priority`. */
  getTicketsByPriority: () =>
    fetchAnalytics<AnalyticsTicketsByPriority>("tickets-by-priority"),

  /** `GET /analytics/sla`. */
  getSla: () => fetchAnalytics<AnalyticsSla>("sla"),

  /** `GET /analytics/csat`. */
  getCsat: () => fetchAnalytics<AnalyticsCsat>("csat"),

  /** `GET /analytics/agents-performance`. */
  getAgentsPerformance: () =>
    fetchAnalytics<AnalyticsAgentsPerformance>("agents-performance"),
};

export type DashboardService = typeof dashboardService;
