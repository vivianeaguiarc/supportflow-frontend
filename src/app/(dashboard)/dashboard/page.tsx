import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardStats } from "@/features/dashboard/components";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      description="Visão geral dos chamados e indicadores de atendimento."
    >
      <DashboardStats />
    </AppShell>
  );
}
