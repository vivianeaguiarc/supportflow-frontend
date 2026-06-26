import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { SupportDeskView } from "@/features/support-desk";

export const metadata: Metadata = {
  title: "Mesa de Atendimento",
};

export default function SupportDeskPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Mesa de Atendimento"
            description="Espaço operacional do atendente: filas, SLA e ações rápidas em um só lugar."
          />
          <Can
            perform="support-desk:access"
            fallback={
              <AccessDenied
                description="A Mesa de Atendimento é exclusiva da equipe de atendimento."
                homeHref="/dashboard"
                homeLabel="Voltar para o dashboard"
              />
            }
          >
            <SupportDeskView />
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
