import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
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
      <Can
        perform="dashboard:view"
        fallback={
          <AccessDenied description="O painel de indicadores está disponível apenas para a equipe de atendimento." />
        }
      >
        <DashboardStats />
      </Can>
    </AppShell>
  );
}
