"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getErrorMessage } from "@/lib/api-error";
import type { Ticket } from "@/types/ticket";

import { DashboardTicketRow } from "./dashboard-ticket-row";

interface DashboardTicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  footer?: ReactNode;
}

/** Lista operacional de chamados com estados padronizados do Design System. */
export function DashboardTicketList({
  tickets,
  isLoading,
  isError,
  error,
  onRetry,
  emptyTitle = "Nenhum chamado",
  emptyDescription,
  footer,
}: DashboardTicketListProps) {
  if (isLoading) return <LoadingState />;
  if (isError) {
    return (
      <ErrorState
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={onRetry}
      />
    );
  }
  if (tickets.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} framed />
    );
  }

  return (
    <>
      <ul className="divide-y divide-border">
        {tickets.map((ticket) => (
          <DashboardTicketRow key={ticket.id} ticket={ticket} />
        ))}
      </ul>
      {footer}
    </>
  );
}
