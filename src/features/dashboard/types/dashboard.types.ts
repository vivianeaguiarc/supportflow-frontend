/**
 * Contrato da resposta de `GET /analytics/overview` (campo `data` do
 * ApiSuccessResponse). Mapeia 1:1 o schema `AnalyticsOverview` do backend.
 */
export interface DashboardOverview {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  slaBreachedTickets: number;
  slaComplianceRate: number;
  avgResolutionTimeHours: number;
  ticketsCreatedByPeriod: DashboardPeriodCount[];
}

export interface DashboardPeriodCount {
  period: string;
  count: number;
}
