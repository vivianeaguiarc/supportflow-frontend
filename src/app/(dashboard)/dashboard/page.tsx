import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { DashboardView } from "@/features/dashboard/components";

export const metadata: Metadata = {
  title: "Central de Atendimento",
};

export default function DashboardPage() {
  return (
    <AppShell variant="operational">
      <PageContainer size="wide" density="comfortable">
        <Can
          perform="dashboard:view"
          fallback={
            <AccessDenied description="O painel de indicadores está disponível apenas para a equipe de atendimento." />
          }
        >
          <DashboardView />
        </Can>
      </PageContainer>
    </AppShell>
  );
}
