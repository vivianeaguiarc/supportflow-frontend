import type { Metadata } from "next";
import { Suspense } from "react";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/ui/loading-state";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { TicketsView } from "@/features/tickets/components";

export const metadata: Metadata = {
  title: "Chamados",
};

export default function TicketsPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Chamados"
            description="Lista de chamados do tenant com filtros, ordenação e paginação."
          />
          <Can
            perform="tickets:view"
            fallback={
              <AccessDenied
                homeHref="/dashboard"
                homeLabel="Voltar para o dashboard"
              />
            }
          >
            <Suspense
              fallback={<LoadingState label="Carregando chamados..." />}
            >
              <TicketsView />
            </Suspense>
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
