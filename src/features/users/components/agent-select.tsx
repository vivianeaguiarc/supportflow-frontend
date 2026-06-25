"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown } from "lucide-react";

import type { User } from "@/types/user";

import { useAgents } from "../hooks/use-agents";
import { USER_ROLE_LABELS } from "../types/user-types";

interface AgentSelectProps {
  /** Id do usuário selecionado ("" quando nenhum). */
  value: string;
  /** Recebe o id do usuário escolhido (ou "" ao limpar). */
  onChange: (id: string) => void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
}

function matchesNameOrEmail(user: User, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return (
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  );
}

/**
 * Combobox assíncrono de agentes/responsáveis. Busca usuários reais via
 * `GET /users`, filtra pelas roles atribuíveis e permite busca por nome/e-mail.
 * Retorna o `id` do usuário selecionado.
 *
 * RBAC: `GET /users` exige `USERS_MANAGE` (apenas ADMIN). O componente pai deve
 * renderizar este seletor somente quando o usuário puder listar (`users:list`),
 * caindo para input manual de UUID caso contrário.
 */
export function AgentSelect({
  value,
  onChange,
  disabled,
  id,
  placeholder = "Buscar agente por nome ou e-mail",
}: AgentSelectProps) {
  const { agents, isLoading, isError } = useAgents({ enabled: true });
  const selected = agents.find((agent) => agent.id === value) ?? null;
  const isDisabled = disabled || isLoading;

  if (isError) {
    return (
      <p className="text-xs text-destructive">
        Não foi possível carregar a lista de agentes.
      </p>
    );
  }

  return (
    <Combobox.Root
      items={agents}
      value={selected}
      onValueChange={(user: User | null) => onChange(user?.id ?? "")}
      itemToStringLabel={(user: User) => user.name}
      itemToStringValue={(user: User) => user.id}
      filter={(user: User, query) => matchesNameOrEmail(user, query)}
      disabled={isDisabled}
    >
      <div className="relative">
        <Combobox.Input
          id={id}
          placeholder={isLoading ? "Carregando agentes..." : placeholder}
          disabled={isDisabled}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 pr-8 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        />
        <Combobox.Icon className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground">
          <ChevronsUpDown className="size-4" />
        </Combobox.Icon>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="z-50">
          <Combobox.Popup className="max-h-64 w-[var(--anchor-width)] min-w-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none">
            <Combobox.Empty className="px-2 py-3 text-sm text-muted-foreground">
              Nenhum agente encontrado.
            </Combobox.Empty>
            <Combobox.List>
              {(user: User) => (
                <Combobox.Item
                  key={user.id}
                  value={user}
                  className="flex cursor-default items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-muted"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email} · {USER_ROLE_LABELS[user.role]}
                    </span>
                  </span>
                  <Combobox.ItemIndicator className="shrink-0 text-primary">
                    <Check className="size-4" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
