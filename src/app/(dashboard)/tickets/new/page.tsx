import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { CreateTicketForm } from "@/features/tickets/components";

export const metadata: Metadata = {
  title: "Novo chamado",
};

export default function NewTicketPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Novo chamado"
            description="Abra um novo chamado preenchendo as informações abaixo."
          />
          <Can
            perform="tickets:create"
            fallback={
              <AccessDenied
                homeHref="/tickets"
                homeLabel="Voltar para os chamados"
                description="Você não tem permissão para criar chamados."
              />
            }
          >
            <PageSection>
              <CreateTicketForm />
            </PageSection>
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
