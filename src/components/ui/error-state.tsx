"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "./button";
import { EmptyState } from "./empty-state";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/** Estado de erro reutilizável — composição sobre `EmptyState` (tom destrutivo). */
export function ErrorState({
  title = "Algo deu errado",
  description,
  onRetry,
  retryLabel = "Tentar novamente",
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      tone="destructive"
      title={title}
      description={description}
      className={className}
      action={
        onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : undefined
      }
    />
  );
}
