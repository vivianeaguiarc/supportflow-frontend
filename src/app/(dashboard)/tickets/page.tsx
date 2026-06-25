import type { Metadata } from "next";
import { Suspense } from "react";

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
          <Suspense fallback={<LoadingState label="Carregando chamados..." />}>
            <TicketsView />
          </Suspense>
        </div>
      </PageContainer>
    </AppShell>
  );
}
