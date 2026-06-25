import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { NotificationCenter } from "@/features/notifications";

export const metadata: Metadata = {
  title: "Notificações",
};

export default function NotificationsPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Notificações"
            description="Acompanhe atualizações de chamados, comentários e alertas de SLA."
          />
          <Can
            perform="notifications:view"
            fallback={
              <AccessDenied
                homeHref="/tickets"
                homeLabel="Voltar para os chamados"
                description="Você não tem permissão para visualizar as notificações."
              />
            }
          >
            <NotificationCenter />
          </Can>
        </div>
      </PageContainer>
    </AppShell>
  );
}
