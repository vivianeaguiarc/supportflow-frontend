"use client";

import type { ReactNode } from "react";

import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/permissions";

interface CanProps {
  /** Permissão exigida, ou lista de permissões avaliada conforme `mode`. */
  perform: Permission | Permission[];
  /** Para listas: `any` (padrão, ao menos uma) ou `all` (todas). */
  mode?: "any" | "all";
  /** Conteúdo alternativo quando não autorizado (padrão: nada). */
  fallback?: ReactNode;
  children: ReactNode;
}

/** Renderização condicional por permissão (RBAC visual). */
export function Can({
  perform,
  mode = "any",
  fallback = null,
  children,
}: CanProps) {
  const { can, canAny, canAll } = usePermissions();

  const allowed = Array.isArray(perform)
    ? mode === "all"
      ? canAll(perform)
      : canAny(perform)
    : can(perform);

  return <>{allowed ? children : fallback}</>;
}
