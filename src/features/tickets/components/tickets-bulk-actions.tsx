"use client";

import type { Table } from "@tanstack/react-table";
import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Can } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AgentSelect } from "@/features/users";
import { usePermissions } from "@/hooks/use-permissions";
import { getErrorMessage } from "@/lib/api-error";
import { ApiError } from "@/types/api";
import type {
  BulkTicketOperationResult,
  Ticket,
  TicketStatus,
} from "@/types/ticket";

import { useBulkAssignTickets, useBulkUpdateTicketStatus } from "../hooks";
import { TICKET_STATUS_LABELS } from "./ticket-status-badge";

const STATUS_OPTIONS: FilterSelectOption[] = Object.entries(
  TICKET_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));

/** Acima deste número de seleções pedimos confirmação extra. */
const CONFIRM_THRESHOLD = 20;

/** Mapeia erros HTTP da operação em lote para mensagens amigáveis. */
function bulkErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return getErrorMessage(error, "Seleção ou dados inválidos.");
      case 403:
        return "Você não tem permissão para executar esta ação.";
      case 404:
        return getErrorMessage(
          error,
          "Um ou mais chamados não foram encontrados.",
        );
      case 409:
        return getErrorMessage(
          error,
          "Transição inválida ou regra de negócio violada.",
        );
    }
  }
  return getErrorMessage(error, "Não foi possível concluir a ação em lote.");
}

function successMessage(result: BulkTicketOperationResult): string {
  return `${result.totalUpdated} de ${result.totalRequested} chamados atualizados com sucesso.`;
}

interface TicketsBulkActionsProps {
  table: Table<Ticket>;
}

/**
 * Barra de ações em lote da tela de tickets. Aparece apenas com seleção e usa os
 * endpoints bulk **atômicos** (`PATCH /tickets/bulk/{status,assign}`) — uma única
 * chamada por ação, sem o antigo loop de N mutations.
 */
export function TicketsBulkActions({ table }: TicketsBulkActionsProps) {
  const selectedRows = table.getSelectedRowModel().rows;
  const ids = selectedRows.map((row) => row.original.id);
  const count = ids.length;

  const bulkStatus = useBulkUpdateTicketStatus();
  const bulkAssign = useBulkAssignTickets();
  const isBusy = bulkStatus.isPending || bulkAssign.isPending;
  const { can } = usePermissions();
  const canListUsers = can("users:list");

  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [statusReason, setStatusReason] = useState("");
  const [statusConfirmed, setStatusConfirmed] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [assignReason, setAssignReason] = useState("");
  const [assignConfirmed, setAssignConfirmed] = useState(false);

  if (count === 0) {
    return null;
  }

  const needsConfirm = count > CONFIRM_THRESHOLD;

  function resetStatus() {
    setStatus("");
    setStatusReason("");
    setStatusConfirmed(false);
  }

  function resetAssign() {
    setAgentId("");
    setAssignReason("");
    setAssignConfirmed(false);
  }

  function handleStatusSubmit() {
    if (!status) return;
    bulkStatus.mutate(
      { ticketIds: ids, status, reason: statusReason.trim() || undefined },
      {
        onSuccess: (result) => {
          toast.success(successMessage(result));
          table.resetRowSelection();
          setStatusOpen(false);
          resetStatus();
        },
        onError: (error) => toast.error(bulkErrorMessage(error)),
      },
    );
  }

  function handleAssignSubmit() {
    const trimmed = agentId.trim();
    if (!trimmed) return;
    bulkAssign.mutate(
      {
        ticketIds: ids,
        assignedToId: trimmed,
        reason: assignReason.trim() || undefined,
      },
      {
        onSuccess: (result) => {
          toast.success(successMessage(result));
          table.resetRowSelection();
          setAssignOpen(false);
          resetAssign();
        },
        onError: (error) => toast.error(bulkErrorMessage(error)),
      },
    );
  }

  const statusApplyDisabled =
    !status || isBusy || (needsConfirm && !statusConfirmed);
  const assignApplyDisabled =
    !agentId.trim() || isBusy || (needsConfirm && !assignConfirmed);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <span className="text-sm font-medium">{count} selecionado(s)</span>

      <Can perform="tickets:changeStatus">
        <Dialog
          open={statusOpen}
          onOpenChange={(open) => {
            setStatusOpen(open);
            if (!open) resetStatus();
          }}
        >
          <DialogTrigger
            render={
              <Button type="button" size="sm" disabled={isBusy}>
                Alterar status
              </Button>
            }
          />
          <DialogContent>
            <DialogTitle>Alterar status em lote</DialogTitle>
            <DialogDescription>
              {count} chamado(s) selecionado(s) serão atualizados em uma única
              operação atômica.
            </DialogDescription>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-status">Novo status</Label>
                <FilterSelect
                  id="bulk-status"
                  placeholder="Selecione um status"
                  options={STATUS_OPTIONS}
                  value={status}
                  onValueChange={(value) => setStatus(value as TicketStatus)}
                  disabled={isBusy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-status-reason">Motivo (opcional)</Label>
                <Textarea
                  id="bulk-status-reason"
                  rows={3}
                  value={statusReason}
                  onChange={(event) => setStatusReason(event.target.value)}
                  placeholder="Justificativa registrada no histórico."
                  disabled={isBusy}
                />
              </div>
              {needsConfirm ? (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={statusConfirmed}
                    onCheckedChange={(checked) =>
                      setStatusConfirmed(Boolean(checked))
                    }
                    disabled={isBusy}
                    aria-label="Confirmar operação em massa"
                  />
                  <span>
                    Confirmo a alteração de {count} chamados (acima de{" "}
                    {CONFIRM_THRESHOLD}).
                  </span>
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                  >
                    Cancelar
                  </Button>
                }
              />
              <Button
                type="button"
                size="sm"
                disabled={statusApplyDisabled}
                onClick={handleStatusSubmit}
              >
                {bulkStatus.isPending ? "Aplicando..." : "Aplicar status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Can>

      <Can perform="tickets:assign">
        <Dialog
          open={assignOpen}
          onOpenChange={(open) => {
            setAssignOpen(open);
            if (!open) resetAssign();
          }}
        >
          <DialogTrigger
            render={
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isBusy}
              >
                <UserPlus />
                Atribuir responsável
              </Button>
            }
          />
          <DialogContent>
            <DialogTitle>Atribuir responsável em lote</DialogTitle>
            <DialogDescription>
              {count} chamado(s) selecionado(s) serão atribuídos em uma única
              operação atômica.
            </DialogDescription>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-agent">Responsável</Label>
                {canListUsers ? (
                  <AgentSelect
                    id="bulk-agent"
                    value={agentId}
                    onChange={setAgentId}
                    disabled={isBusy}
                  />
                ) : (
                  // Sem permissão para listar usuários (ex.: SUPERVISOR): mantém
                  // input manual de UUID para não bloquear a ação em lote.
                  <Input
                    id="bulk-agent"
                    value={agentId}
                    onChange={(event) => setAgentId(event.target.value)}
                    placeholder="ID do atendente (UUID)"
                    disabled={isBusy}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-assign-reason">Motivo (opcional)</Label>
                <Textarea
                  id="bulk-assign-reason"
                  rows={3}
                  value={assignReason}
                  onChange={(event) => setAssignReason(event.target.value)}
                  placeholder="Justificativa registrada no histórico."
                  disabled={isBusy}
                />
              </div>
              {needsConfirm ? (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={assignConfirmed}
                    onCheckedChange={(checked) =>
                      setAssignConfirmed(Boolean(checked))
                    }
                    disabled={isBusy}
                    aria-label="Confirmar operação em massa"
                  />
                  <span>
                    Confirmo a atribuição de {count} chamados (acima de{" "}
                    {CONFIRM_THRESHOLD}).
                  </span>
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                  >
                    Cancelar
                  </Button>
                }
              />
              <Button
                type="button"
                size="sm"
                disabled={assignApplyDisabled}
                onClick={handleAssignSubmit}
              >
                {bulkAssign.isPending ? "Atribuindo..." : "Atribuir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Can>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="ml-auto"
        onClick={() => table.resetRowSelection()}
        disabled={isBusy}
      >
        <X />
        Limpar seleção
      </Button>
    </div>
  );
}
