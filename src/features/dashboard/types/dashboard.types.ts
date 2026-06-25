/**
 * Contratos de analytics do dashboard.
 * Fonte da verdade: `supportflow-backend/.../analytics/domain/analytics-types.ts`
 * (respostas no campo `data` do `ApiSuccessResponse`). Nenhum campo inventado.
 */
import type { TicketPriority, TicketStatus } from "@/types/ticket";

export interface DashboardPeriodCount {
  period: string;
  count: number;
}

/** `GET /analytics/overview` (schema `AnalyticsOverview`). */
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

/** `GET /analytics/tickets-by-status` (schema `AnalyticsTicketsByStatus`). */
export interface AnalyticsTicketsByStatus {
  total: number;
  byStatus: Record<TicketStatus, number>;
}

/** `GET /analytics/tickets-by-priority` (schema `AnalyticsTicketsByPriority`). */
export interface AnalyticsTicketsByPriority {
  total: number;
  byPriority: Record<TicketPriority, number>;
}

/** `GET /analytics/sla` (schema `AnalyticsSla`). */
export interface AnalyticsSla {
  onTime: number;
  warning: number;
  breached: number;
  total: number;
  slaComplianceRate: number;
  slaBreachedTickets: number;
}

/** Item de `GET /analytics/agents-performance` (schema `AgentMetrics`). */
export interface AgentPerformanceMetrics {
  agentId: string;
  agentName: string;
  assignedTickets: number;
  resolvedTickets: number;
  openTickets: number;
  slaBreachedTickets: number;
  avgResolutionTimeHours: number;
}

/** `GET /analytics/agents-performance` (schema `AnalyticsAgentsPerformance`). */
export interface AnalyticsAgentsPerformance {
  agents: AgentPerformanceMetrics[];
}

export interface CsatRatingDistribution {
  rating: number;
  count: number;
}

export interface CsatAgentAverage {
  agentId: string;
  agentName: string;
  averageRating: number;
  totalSurveys: number;
}

export interface CsatPeriodAverage {
  period: string;
  averageRating: number;
  count: number;
}

/** `GET /analytics/csat` (schema `AnalyticsCsat`). */
export interface AnalyticsCsat {
  averageRating: number;
  totalSurveys: number;
  distribution: CsatRatingDistribution[];
  byAgent: CsatAgentAverage[];
  byPeriod: CsatPeriodAverage[];
}
