"use client";

import { Inbox } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import type { Ticket } from "@/types/ticket";

import { DeskTicketCard } from "./desk-ticket-card";

interface DeskQueueListProps {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
}

/** Lista (grade compacta) de chamados da fila ativa, com estados de UI. */
export function DeskQueueList({
  tickets,
  isLoading,
  isError,
  error,
  onRetry,
  selectedId,
  onSelect,
}: DeskQueueListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a fila"
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={onRetry}
      />
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nenhum chamado nesta fila"
        description="Quando houver chamados que atendam a este filtro, eles aparecerão aqui."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {tickets.map((ticket) => (
        <DeskTicketCard
          key={ticket.id}
          ticket={ticket}
          isActive={ticket.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
