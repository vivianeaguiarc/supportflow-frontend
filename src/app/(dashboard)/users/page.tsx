import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { UsersTable } from "@/features/users/components";

export const metadata: Metadata = {
  title: "Equipe",
};

export default function UsersPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Equipe"
            description="Usuários do tenant com busca, filtro por papel e paginação."
          />
          <Can
            perform="users:list"
            fallback={
              <AccessDenied
                homeHref="/tickets"
                homeLabel="Voltar para os chamados"
                description="Você não tem permissão para visualizar a equipe."
              />
            }
          >
            <UsersTable />
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
