import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { CustomersTable } from "@/features/customers/components";

export const metadata: Metadata = {
  title: "Clientes",
};

export default function CustomersPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Clientes"
            description="Diretório de clientes do tenant com busca, filtros e paginação."
          />
          <Can
            perform="directory:view"
            fallback={
              <AccessDenied
                homeHref="/tickets"
                homeLabel="Voltar para os chamados"
                description="Você não tem permissão para visualizar os clientes."
              />
            }
          >
            <CustomersTable />
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
