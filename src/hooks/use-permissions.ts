"use client";

import { useMemo } from "react";

import { useAuth } from "@/features/auth/hooks";
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  type Permission,
} from "@/lib/permissions";

/**
 * Hook de autorização baseado na role do usuário autenticado (`useAuth`).
 * Expõe helpers para condicionar UI por permissão. Lembre-se: é apenas UX —
 * a autorização real é validada pelo backend a cada chamada.
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return useMemo(
    () => ({
      role,
      can: (permission: Permission) => hasPermission(role, permission),
      canAny: (permissions: Permission[]) =>
        hasAnyPermission(role, permissions),
      canAll: (permissions: Permission[]) =>
        hasAllPermissions(role, permissions),
    }),
    [role],
  );
}
