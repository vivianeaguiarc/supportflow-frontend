"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataField } from "@/components/ui/data-field";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { getErrorMessage } from "@/lib/api-error";

import { useUser } from "../hooks";
import { ASSIGNABLE_ROLES } from "../types/user-types";
import { UserRoleBadge } from "./user-role-badge";
import { UserTicketsTable } from "./user-tickets-table";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

interface UserDetailProps {
  userId: string;
}

/**
 * Detalhe de um usuário (`GET /users/{id}`). Para papéis que podem receber
 * chamados (ADMIN, SUPERVISOR, AGENT) também exibe os chamados atribuídos,
 * reutilizando a tabela real de tickets filtrada por `assignedToId`.
 */
export function UserDetail({ userId }: UserDetailProps) {
  const { data: user, isLoading, isError, error, refetch } = useUser(userId);

  const canBeAssigned = user ? ASSIGNABLE_ROLES.includes(user.role) : false;

  return (
    <div className="space-y-6">
      <PageHeader
        title={user?.name ?? "Detalhe do usuário"}
        description={user?.email ?? userId}
        actions={
          <Link
            href="/users"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Voltar para a equipe
          </Link>
        }
      />

      <PageSection title="Informações do usuário">
        <Card>
          <CardContent>
            {isLoading ? (
              <LoadingState label="Carregando usuário..." />
            ) : isError ? (
              <ErrorState
                title="Não foi possível carregar o usuário"
                description={getErrorMessage(
                  error,
                  "Tente novamente em instantes.",
                )}
                onRetry={() => refetch()}
              />
            ) : user ? (
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DataField label="Nome" value={user.name} />
                <DataField label="E-mail" value={user.email} />
                <DataField
                  label="Papel"
                  value={<UserRoleBadge role={user.role} />}
                />
                <DataField
                  label="Cadastrado em"
                  value={formatDate(user.createdAt)}
                />
                <DataField
                  label="ID"
                  value={
                    <span
                      className="font-mono text-xs break-all text-muted-foreground"
                      title={user.id}
                    >
                      {user.id}
                    </span>
                  }
                />
                <DataField
                  label="Tenant"
                  value={
                    <span className="font-mono text-xs break-all text-muted-foreground">
                      {user.tenantId}
                    </span>
                  }
                />
              </dl>
            ) : null}
          </CardContent>
        </Card>
      </PageSection>

      {canBeAssigned ? (
        <PageSection title="Chamados atribuídos">
          <UserTicketsTable userId={userId} />
        </PageSection>
      ) : null}
    </div>
  );
}
