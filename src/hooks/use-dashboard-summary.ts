/**
 * Hook público do resumo do dashboard (`GET /analytics/overview`).
 *
 * Implementação canônica: `useDashboardStats` em `src/features/dashboard/hooks`.
 * Exportado também como `useDashboardSummary` (nome citado na documentação).
 */
export {
  DASHBOARD_OVERVIEW_QUERY_KEY,
  useDashboardStats,
  useDashboardStats as useDashboardSummary,
} from "@/features/dashboard/hooks";
