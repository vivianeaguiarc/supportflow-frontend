"use client";

import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";

import { AUDIT_ACTION_OPTIONS, AUDIT_ENTITY_OPTIONS } from "../types";

export interface AuditFiltersValue {
  userId?: string;
  entityId?: string;
  action?: string;
  entity?: string;
}

interface AuditFiltersProps {
  filters: AuditFiltersValue;
  hasActiveFilters: boolean;
  onChange: (updates: AuditFiltersValue) => void;
  onReset: () => void;
}

/**
 * Filtros server-side da trilha de auditoria, restritos ao que o contrato
 * aceita (`userId`, `entityId`, `action`, `entity`).
 *
 * O backend **não** oferece busca textual livre nem filtro por período/data,
 * então estes não são expostos (ver explicação/lacunas na resposta da tarefa).
 */
export function AuditFilters({
  filters,
  hasActiveFilters,
  onChange,
  onReset,
}: AuditFiltersProps) {
  function handleIdsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userId = String(formData.get("userId") ?? "").trim();
    const entityId = String(formData.get("entityId") ?? "").trim();
    onChange({
      userId: userId || undefined,
      entityId: entityId || undefined,
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form onSubmit={handleIdsSubmit} className="flex items-center gap-2">
        <SearchInput
          key={`user-${filters.userId ?? ""}`}
          name="userId"
          defaultValue={filters.userId ?? ""}
          placeholder="ID do usuário..."
          containerClassName="w-44"
          aria-label="Filtrar por ID do usuário"
        />
        <SearchInput
          key={`entity-${filters.entityId ?? ""}`}
          name="entityId"
          defaultValue={filters.entityId ?? ""}
          placeholder="ID do recurso..."
          containerClassName="w-44"
          aria-label="Filtrar por ID do recurso"
        />
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

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
