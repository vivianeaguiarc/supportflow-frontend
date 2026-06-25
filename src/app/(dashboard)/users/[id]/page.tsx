import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { UserDetail } from "@/features/users/components";

export const metadata: Metadata = {
  title: "Detalhe do usuário",
};

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <PageContainer>
        <Can
          perform="users:list"
          fallback={
            <AccessDenied
              homeHref="/users"
              homeLabel="Voltar para a equipe"
              description="Você não tem permissão para visualizar este usuário."
            />
          }
        >
          <UserDetail userId={id} />
        </Can>
      </PageContainer>
    </AppShell>
  );
}
