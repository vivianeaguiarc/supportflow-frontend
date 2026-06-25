import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardView } from "@/features/dashboard/components";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Dashboard"
            description="Indicadores de atendimento e analytics do tenant."
          />
          <Can
            perform="dashboard:view"
            fallback={
              <AccessDenied description="O painel de indicadores está disponível apenas para a equipe de atendimento." />
            }
          >
            <DashboardView />
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
