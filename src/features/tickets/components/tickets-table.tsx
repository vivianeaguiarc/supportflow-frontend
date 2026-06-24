"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/types/api";

import { useTickets } from "../hooks";
import { DEFAULT_LIST_TICKETS_PARAMS } from "../schemas";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusBadge } from "./ticket-status-badge";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function TicketsTable() {
  const { data, isLoading, isError, error } = useTickets(
    DEFAULT_LIST_TICKETS_PARAMS,
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chamados recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Não foi possível carregar os chamados.";

    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
          <AlertCircle className="size-4 text-destructive" />
          {message}
        </CardContent>
      </Card>
    );
  }

  const tickets = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chamados recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum chamado encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Protocolo</th>
                  <th className="pb-3 pr-4 font-medium">Título</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Prioridade</th>
                  <th className="pb-3 font-medium">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {ticket.protocol}
                      </Link>
                    </td>
                    <td className="max-w-xs truncate py-3 pr-4">
                      {ticket.title}
                    </td>
                    <td className="py-3 pr-4">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
