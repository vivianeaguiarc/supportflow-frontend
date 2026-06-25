"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageSection } from "@/components/ui/page-section";
import { getErrorMessage } from "@/lib/api-error";

interface AnalyticsSectionProps {
  title: string;
  description?: string;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry: () => void;
  children: ReactNode;
}

/**
 * Casca de seção de analytics: padroniza loading/erro/vazio sobre o Design
 * System, evitando repetição entre as várias seções do dashboard.
 */
export function AnalyticsSection({
  title,
  description,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyTitle = "Sem dados",
  emptyDescription,
  onRetry,
  children,
}: AnalyticsSectionProps) {
  return (
    <PageSection title={title} description={description}>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          description={getErrorMessage(error, "Tente novamente em instantes.")}
          onRetry={onRetry}
        />
      ) : isEmpty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        children
      )}
    </PageSection>
  );
}
