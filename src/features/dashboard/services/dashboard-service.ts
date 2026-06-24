import type { DashboardStats } from "../types";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    throw new Error("dashboardService.getStats ainda não foi implementado.");
  },
};
