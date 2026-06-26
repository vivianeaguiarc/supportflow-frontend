"use client";

import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";

import { AUDIT_ACTION_OPTIONS, AUDIT_ENTITY_OPTIONS } from "../types";

export interface AuditFiltersValue {
  search?: string;
  userId?: string;
  entityId?: string;
  action?: string;
  entity?: string;
  /** Data inicial no formato `YYYY-MM-DD` (input nativo). */
  createdFrom?: string;
  /** Data final no formato `YYYY-MM-DD` (input nativo). */
  createdTo?: string;
}

interface AuditFiltersProps {
  filters: AuditFiltersValue;
  hasActiveFilters: boolean;
  onChange: (updates: AuditFiltersValue) => void;
  onReset: () => void;
}

/**
 * Filtros server-side da trilha de auditoria, sincronizados com a URL.
 *
 * Texto livre + ids vão por um formulário (aplicados no submit); período (datas)
 * e ação/entidade aplicam ao mudar. Todos refletem o contrato real do backend
 * (`search`, `createdFrom`, `createdTo`, `userId`, `entityId`, `action`, `entity`).
 */
export function AuditFilters({
  filters,
  hasActiveFilters,
  onChange,
  onReset,
}: AuditFiltersProps) {
  function handleTextSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onChange({
      search: String(formData.get("search") ?? "").trim() || undefined,
      userId: String(formData.get("userId") ?? "").trim() || undefined,
      entityId: String(formData.get("entityId") ?? "").trim() || undefined,
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <form
        onSubmit={handleTextSubmit}
        className="flex flex-wrap items-center gap-2"
      >
        <SearchInput
          key={`search-${filters.search ?? ""}`}
          name="search"
          defaultValue={filters.search ?? ""}
          placeholder="Buscar (ação, recurso, IP...)"
          containerClassName="w-60"
          aria-label="Busca textual"
        />
        <SearchInput
          key={`user-${filters.userId ?? ""}`}
          name="userId"
          defaultValue={filters.userId ?? ""}
          placeholder="ID do usuário..."
          containerClassName="w-40"
          aria-label="Filtrar por ID do usuário"
        />
        <SearchInput
          key={`entity-${filters.entityId ?? ""}`}
          name="entityId"
          defaultValue={filters.entityId ?? ""}
          placeholder="ID do recurso..."
          containerClassName="w-40"
          aria-label="Filtrar por ID do recurso"
        />
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

      <div className="flex items-center gap-1.5">
        <Input
          type="date"
          aria-label="Data inicial"
          className="w-40"
          value={filters.createdFrom ?? ""}
          max={filters.createdTo || undefined}
          onChange={(event) =>
            onChange({ createdFrom: event.target.value || undefined })
          }
        />
        <span className="text-xs text-muted-foreground">até</span>
        <Input
          type="date"
          aria-label="Data final"
          className="w-40"
          value={filters.createdTo ?? ""}
          min={filters.createdFrom || undefined}
          onChange={(event) =>
            onChange({ createdTo: event.target.value || undefined })
          }
        />
      </div>

      <FilterSelect
        aria-label="Filtrar por ação"
        className="w-52"
        placeholder="Todas as ações"
        options={AUDIT_ACTION_OPTIONS}
        value={filters.action ?? ""}
        onValueChange={(value) => onChange({ action: value || undefined })}
      />

      <FilterSelect
        aria-label="Filtrar por entidade"
        className="w-48"
        placeholder="Todas as entidades"
        options={AUDIT_ENTITY_OPTIONS}
        value={filters.entity ?? ""}
        onValueChange={(value) => onChange({ entity: value || undefined })}
      />

      {hasActiveFilters ? (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Limpar
        </Button>
      ) : null}
    </div>
  );
}
