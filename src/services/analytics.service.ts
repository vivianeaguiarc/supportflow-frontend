/**
 * Camada pública de service de analytics/dashboard.
 *
 * A implementação canônica vive em `src/features/dashboard/services`
 * (`dashboardService`). Reexportado aqui como `analyticsService` para o ponto de
 * entrada estável citado na documentação (`src/services/analytics.service.ts`).
 *
 * `analyticsService.getOverview()` consome `GET /analytics/overview` via BFF
 * `/api/dashboard/overview`.
 */
export { dashboardService as analyticsService } from "@/features/dashboard/services";
