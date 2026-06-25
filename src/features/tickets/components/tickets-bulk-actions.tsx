"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Can } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";
import { Input } from "@/components/ui/input";
import type { Ticket, TicketStatus } from "@/types/ticket";

import { type BulkActionResult, useBulkTicketActions } from "../hooks";
import { TICKET_STATUS_LABELS } from "./ticket-status-badge";

const STATUS_OPTIONS: FilterSelectOption[] = Object.entries(
  TICKET_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));

interface TicketsBulkActionsProps {
  table: Table<Ticket>;
}

function reportResult(result: BulkActionResult, noun: string) {
  if (result.failed.length === 0) {
    toast.success(`${result.succeeded} ${noun} com sucesso.`);
  } else if (result.succeeded === 0) {
    toast.error(`Nenhum chamado atualizado. ${result.failed.length} com erro.`);
  } else {
    toast.warning(
      `${result.succeeded} ${noun}; ${result.failed.length} com erro.`,
    );
  }
}

/**
 * Barra de ações em lote para os tickets selecionados. Aparece apenas quando há
 * seleção. Usa `table.getSelectedRowModel()` para obter as linhas marcadas na
 * página atual e dispara mutações individuais com confirmação explícita.
 */
export function TicketsBulkActions({ table }: TicketsBulkActionsProps) {
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [agentId, setAgentId] = useState("");

  const { updateStatus, assign } = useBulkTicketActions();

  const selectedRows = table.getSelectedRowModel().rows;
  const ids = selectedRows.map((row) => row.original.id);
  const count = ids.length;

  if (count === 0) {
    return null;
  }

  const trimmedAgentId = agentId.trim();
  const isBusy = updateStatus.isPending || assign.isPending;

  function clearSelection() {
    table.resetRowSelection();
  }

  function handleBulkStatus() {
    if (!status) return;
    updateStatus.mutate(
      { ids, status },
      {
        onSuccess: (result) => {
          reportResult(result, "chamado(s) atualizado(s)");
          setStatus("");
          clearSelection();
        },
        onError: () => toast.error("Falha ao atualizar os chamados."),
      },
    );
  }

  function handleBulkAssign() {
    if (!trimmedAgentId) return;
    assign.mutate(
      { ids, agentId: trimmedAgentId },
      {
        onSuccess: (result) => {
          reportResult(result, "chamado(s) atribuído(s)");
          setAgentId("");
          clearSelection();
        },
        onError: () => toast.error("Falha ao atribuir os chamados."),
      },
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <span className="text-sm font-medium">
        {count} selecionado(s) nesta página
      </span>

      <Can perform="tickets:changeStatus">
        <div className="flex items-center gap-2">
          <FilterSelect
            aria-label="Status para aplicar em lote"
            className="w-48"
            placeholder="Alterar status..."
            options={STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => setStatus(value as TicketStatus)}
            disabled={isBusy}
          />
          <ConfirmDialog
            trigger={
              <Button type="button" size="sm" disabled={!status || isBusy}>
                {updateStatus.isPending ? "Aplicando..." : "Aplicar"}
              </Button>
            }
            title="Alterar status em lote"
            description={
              status
                ? `Confirmar a alteração de ${count} chamado(s) para "${TICKET_STATUS_LABELS[status]}"? Transições inválidas para alguns chamados podem falhar individualmente.`
                : "Selecione um status."
            }
            confirmLabel="Alterar"
            onConfirm={handleBulkStatus}
          />
        </div>
      </Can>

      <Can perform="tickets:assign">
        <div className="flex items-center gap-2">
          <Input
            aria-label="ID do atendente (UUID) para atribuição em lote"
            className="w-56"
            placeholder="ID do atendente (UUID)"
            value={agentId}
            onChange={(event) => setAgentId(event.target.value)}
            disabled={isBusy}
          />
          <ConfirmDialog
            trigger={
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!trimmedAgentId || isBusy}
              >
                {assign.isPending ? "Atribuindo..." : "Atribuir"}
              </Button>
            }
            title="Atribuir responsável em lote"
            description={`Confirmar a atribuição de ${count} chamado(s) ao atendente informado?`}
            confirmLabel="Atribuir"
            onConfirm={handleBulkAssign}
          />
        </div>
      </Can>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="ml-auto"
        onClick={clearSelection}
        disabled={isBusy}
      >
        <X />
        Limpar seleção
      </Button>
    </div>
  );
}
