"use client";

import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

import { TICKET_PRIORITY_LABELS } from "./ticket-priority-badge";
import { TICKET_STATUS_LABELS } from "./ticket-status-badge";

const STATUS_OPTIONS: FilterSelectOption[] = Object.entries(
  TICKET_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));

const PRIORITY_OPTIONS: FilterSelectOption[] = Object.entries(
  TICKET_PRIORITY_LABELS,
).map(([value, label]) => ({ value, label }));

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
        <SearchInput
          key={filters.search ?? ""}
          name="search"
          defaultValue={filters.search ?? ""}
          placeholder="Buscar por título ou descrição..."
          containerClassName="w-64"
          aria-label="Buscar chamados"
        />
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

      <FilterSelect
        aria-label="Filtrar por status"
        className="w-48"
        placeholder="Todos os status"
        options={STATUS_OPTIONS}
        value={filters.status ?? ""}
        onValueChange={(value) =>
          onChange({ status: (value || undefined) as TicketStatus })
        }
      />

      <FilterSelect
        aria-label="Filtrar por prioridade"
        className="w-48"
        placeholder="Todas as prioridades"
        options={PRIORITY_OPTIONS}
        value={filters.priority ?? ""}
        onValueChange={(value) =>
          onChange({ priority: (value || undefined) as TicketPriority })
        }
      />

      {hasActiveFilters ? (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Limpar
        </Button>
      ) : null}
    </div>
  );
}
