import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { CustomerDetail } from "@/features/customers/components";

export const metadata: Metadata = {
  title: "Detalhe do cliente",
};

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <PageContainer>
        <Can
          perform="directory:view"
          fallback={
            <AccessDenied
              homeHref="/customers"
              homeLabel="Voltar para clientes"
              description="Você não tem permissão para visualizar este cliente."
            />
          }
        >
          <CustomerDetail customerId={id} />
        </Can>
      </PageContainer>
    </AppShell>
  );
}
