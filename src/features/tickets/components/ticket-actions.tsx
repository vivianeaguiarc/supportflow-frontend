"use client";

import { type FormEvent, useState } from "react";

import { Can } from "@/components/auth";
import { ConfirmActionDialog } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgentSelect } from "@/features/users";
import { usePermissions } from "@/hooks/use-permissions";
import { getErrorMessage } from "@/lib/api-error";
import type { Ticket, TicketStatus } from "@/types/ticket";

import { useAssignTicket } from "../hooks/use-assign-ticket";
import { useTicketTransitions } from "../hooks/use-ticket-transitions";
import { useUpdateTicketStatus } from "../hooks/use-update-ticket-status";
import { TICKET_STATUS_LABELS } from "./ticket-status-badge";

const ALL_STATUSES = Object.keys(TICKET_STATUS_LABELS) as TicketStatus[];

interface TicketActionsProps {
  ticket: Ticket;
}

export function TicketActions({ ticket }: TicketActionsProps) {
  const [statusChoice, setStatusChoice] = useState<TicketStatus | "">("");
  const [agentId, setAgentId] = useState(ticket.assignedToId ?? "");

  const transitions = useTicketTransitions(ticket.id);
  const updateStatus = useUpdateTicketStatus();
  const assignTicket = useAssignTicket();
  const { can } = usePermissions();
  const canListUsers = can("users:list");

  const allowedTransitions = transitions.data?.allowedTransitions ?? [];
  const allowedSet = new Set<TicketStatus>(allowedTransitions);
  const selected: TicketStatus | "" =
    statusChoice || allowedTransitions[0] || "";
  const selectValue = selected || ticket.status;
  const noTransitions =
    !transitions.isLoading &&
    !transitions.isError &&
    allowedTransitions.length === 0;
  const statusDisabled =
    transitions.isLoading || noTransitions || updateStatus.isPending;

  const trimmedAgentId = agentId.trim();
  const assigneeUnchanged = trimmedAgentId === (ticket.assignedToId ?? "");

  function handleStatusConfirm() {
    if (!selected) return;
    // Feedback (sucesso/erro) é centralizado no MutationCache via `meta`.
    updateStatus.mutate({ id: ticket.id, status: selected });
  }

  function handleAssignSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedAgentId || assigneeUnchanged) return;
    assignTicket.mutate({ id: ticket.id, agentId: trimmedAgentId });
  }

  return (
    <div className="space-y-6">
      <Can perform="tickets:changeStatus">
        <div className="space-y-2">
          <Label htmlFor="ticket-status">Alterar status</Label>
          <select
            id="ticket-status"
            className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            value={selectValue}
            onChange={(event) =>
              setStatusChoice(event.target.value as TicketStatus)
            }
            disabled={statusDisabled}
          >
            {ALL_STATUSES.map((value) => (
              <option
                key={value}
                value={value}
                disabled={!allowedSet.has(value)}
              >
                {TICKET_STATUS_LABELS[value]}
                {value === ticket.status ? " (atual)" : ""}
              </option>
            ))}
          </select>

          {transitions.isError ? (
            <p className="text-xs text-destructive">
              {getErrorMessage(
                transitions.error,
                "Não foi possível carregar as transições válidas.",
              )}
            </p>
          ) : noTransitions ? (
            <p className="text-xs text-muted-foreground">
              Nenhuma transição de status disponível para o estado atual.
            </p>
          ) : null}

          <ConfirmActionDialog
            trigger={
              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={!selected || statusDisabled}
              >
                {updateStatus.isPending ? "Salvando..." : "Atualizar status"}
              </Button>
            }
            title="Alterar status do chamado"
            description={
              selected
                ? `Confirmar a alteração do status para "${TICKET_STATUS_LABELS[selected]}"?`
                : "Selecione um status válido."
            }
            confirmLabel="Alterar"
            onConfirm={handleStatusConfirm}
          />
        </div>
      </Can>

      <Can perform="tickets:assign">
        <form onSubmit={handleAssignSubmit} className="space-y-2">
          <Label htmlFor="ticket-assignee">Atribuir responsável</Label>
          {canListUsers ? (
            <AgentSelect
              id="ticket-assignee"
              value={agentId}
              onChange={setAgentId}
              disabled={assignTicket.isPending}
            />
          ) : (
            // Sem permissão para listar usuários (ex.: SUPERVISOR): mantém o
            // input manual de UUID para não bloquear a ação.
            <Input
              id="ticket-assignee"
              value={agentId}
              onChange={(event) => setAgentId(event.target.value)}
              placeholder="ID do atendente (UUID)"
              disabled={assignTicket.isPending}
            />
          )}
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
      </Can>
    </div>
  );
}
