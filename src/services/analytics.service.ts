/**
 * Camada pública de service de analytics/dashboard.
 *
 * A implementação canônica vive em `src/features/dashboard/services`
 * (`dashboardService`). Reexportado aqui como `analyticsService` para o ponto de
 * entrada estável citado na documentação (`src/services/analytics.service.ts`).
 *
 * Os métodos consomem os endpoints reais de analytics via BFF
 * `/api/analytics/{metric}` (overview, tickets-by-status, tickets-by-priority,
 * sla, agents-performance, csat).
 */
export { dashboardService as analyticsService } from "@/features/dashboard/services";
