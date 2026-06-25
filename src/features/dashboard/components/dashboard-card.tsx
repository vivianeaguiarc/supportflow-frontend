"use client";

import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  /** Elemento à direita do título (legenda, link "Ver todos", etc.). */
  action?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

/**
 * Card autocontido para os widgets do dashboard: título interno + ação opcional
 * e tratamento padronizado de loading/erro/vazio sobre o Design System.
 *
 * Diferente da `AnalyticsSection` (título fora do card via `PageSection`), aqui
 * o título vive dentro do card — o layout em grade do dashboard.
 */
export function DashboardCard({
  title,
  action,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyTitle = "Sem dados",
  emptyDescription,
  onRetry,
  className,
  contentClassName,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn("flex-1", contentClassName)}>
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            description={getErrorMessage(
              error,
              "Tente novamente em instantes.",
            )}
            onRetry={onRetry}
          />
        ) : isEmpty ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
