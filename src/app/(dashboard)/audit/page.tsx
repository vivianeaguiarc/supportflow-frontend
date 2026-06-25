import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { AuditTable } from "@/features/audit";

export const metadata: Metadata = {
  title: "Auditoria",
};

export default function AuditPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Auditoria"
            description="Trilha imutável das operações do sistema, com filtros e verificação de integridade."
          />
          <Can
            perform="audit:view"
            fallback={
              <AccessDenied
                homeHref="/dashboard"
                homeLabel="Voltar para o dashboard"
                description="Você não tem permissão para visualizar a auditoria."
              />
            }
          >
            <AuditTable />
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
