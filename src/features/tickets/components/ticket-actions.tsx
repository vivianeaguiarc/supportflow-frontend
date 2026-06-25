"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api-error";
import type { Ticket, TicketStatus } from "@/types/ticket";

import { useAssignTicket } from "../hooks/use-assign-ticket";
import { useUpdateTicketStatus } from "../hooks/use-update-ticket-status";
import { TICKET_STATUS_LABELS } from "./ticket-status-badge";

const STATUS_OPTIONS = Object.entries(TICKET_STATUS_LABELS) as [
  TicketStatus,
  string,
][];

interface TicketActionsProps {
  ticket: Ticket;
}

export function TicketActions({ ticket }: TicketActionsProps) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [agentId, setAgentId] = useState(ticket.assignedToId ?? "");

  const updateStatus = useUpdateTicketStatus();
  const assignTicket = useAssignTicket();

  const statusUnchanged = status === ticket.status;
  const trimmedAgentId = agentId.trim();
  const assigneeUnchanged = trimmedAgentId === (ticket.assignedToId ?? "");

  function handleStatusConfirm() {
    if (statusUnchanged) return;

    updateStatus.mutate(
      { id: ticket.id, status },
      {
        onSuccess: () =>
          toast.success(
            `Status alterado para "${TICKET_STATUS_LABELS[status]}".`,
          ),
        onError: (error) =>
          toast.error(
            getErrorMessage(error, "Não foi possível alterar o status."),
          ),
      },
    );
  }

  function handleAssignSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedAgentId || assigneeUnchanged) return;

    assignTicket.mutate(
      { id: ticket.id, agentId: trimmedAgentId },
      {
        onSuccess: () => toast.success("Chamado atribuído com sucesso."),
        onError: (error) =>
          toast.error(
            getErrorMessage(error, "Não foi possível atribuir o chamado."),
          ),
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ticket-status">Alterar status</Label>
        <select
          id="ticket-status"
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          value={status}
          onChange={(event) => setStatus(event.target.value as TicketStatus)}
          disabled={updateStatus.isPending}
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ConfirmDialog
          trigger={
            <Button
              type="button"
              size="sm"
              className="w-full"
              disabled={statusUnchanged || updateStatus.isPending}
            >
              {updateStatus.isPending ? "Salvando..." : "Atualizar status"}
            </Button>
          }
          title="Alterar status do chamado"
          description={`Confirmar a alteração do status para "${TICKET_STATUS_LABELS[status]}"?`}
          confirmLabel="Alterar"
          onConfirm={handleStatusConfirm}
        />
      </div>

      <form onSubmit={handleAssignSubmit} className="space-y-2">
        <Label htmlFor="ticket-assignee">Atribuir responsável</Label>
        <Input
          id="ticket-assignee"
          value={agentId}
          onChange={(event) => setAgentId(event.target.value)}
          placeholder="ID do atendente (UUID)"
          disabled={assignTicket.isPending}
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          className="w-full"
          disabled={
            !trimmedAgentId || assigneeUnchanged || assignTicket.isPending
          }
        >
          {assignTicket.isPending ? "Atribuindo..." : "Atribuir chamado"}
        </Button>
      </form>
    </div>
  );
}
