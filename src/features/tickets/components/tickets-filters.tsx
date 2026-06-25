"use client";

import { Search, X } from "lucide-react";
import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

import { TICKET_PRIORITY_LABELS } from "./ticket-priority-badge";
import { TICKET_STATUS_LABELS } from "./ticket-status-badge";

const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const STATUS_OPTIONS = Object.entries(TICKET_STATUS_LABELS) as [
  TicketStatus,
  string,
][];
const PRIORITY_OPTIONS = Object.entries(TICKET_PRIORITY_LABELS) as [
  TicketPriority,
  string,
][];

export interface TicketsFiltersValue {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}

interface TicketsFiltersProps {
  filters: TicketsFiltersValue;
  hasActiveFilters: boolean;
  onChange: (updates: TicketsFiltersValue) => void;
  onReset: () => void;
}

export function TicketsFilters({
  filters,
  hasActiveFilters,
  onChange,
  onReset,
}: TicketsFiltersProps) {
  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    onChange({ search: search || undefined });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            key={filters.search ?? ""}
            name="search"
            defaultValue={filters.search ?? ""}
            placeholder="Buscar por título ou descrição..."
            className="w-64 pl-8"
            aria-label="Buscar chamados"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

      <select
        aria-label="Filtrar por status"
        className={SELECT_CLASS}
        value={filters.status ?? ""}
        onChange={(event) =>
          onChange({
            status: (event.target.value || undefined) as TicketStatus,
          })
        }
      >
        <option value="">Todos os status</option>
        {STATUS_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por prioridade"
        className={SELECT_CLASS}
        value={filters.priority ?? ""}
        onChange={(event) =>
          onChange({
            priority: (event.target.value || undefined) as TicketPriority,
          })
        }
      >
        <option value="">Todas as prioridades</option>
        {PRIORITY_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {hasActiveFilters ? (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X />
          Limpar
        </Button>
      ) : null}
    </div>
  );
}
