/**
 * Query keys centralizadas do domínio de analytics/dashboard.
 * Hierarquia sob `["dashboard"]` permite invalidar tudo (`all`) de uma vez.
 */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  byStatus: () => [...dashboardKeys.all, "tickets-by-status"] as const,
  byPriority: () => [...dashboardKeys.all, "tickets-by-priority"] as const,
  sla: () => [...dashboardKeys.all, "sla"] as const,
  csat: () => [...dashboardKeys.all, "csat"] as const,
  agentsPerformance: () =>
    [...dashboardKeys.all, "agents-performance"] as const,
};
