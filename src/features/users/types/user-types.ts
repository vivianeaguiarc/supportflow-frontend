import type { UserRole } from "@/types/user";

export type { ListUsersParams, User, UserRole } from "@/types/user";

/**
 * Roles que podem ser responsáveis por tickets.
 * Espelha `canBeAssignedTickets` do backend (ADMIN, SUPERVISOR, AGENT) —
 * CUSTOMER e OMBUDSMAN não recebem atribuição direta.
 */
export const ASSIGNABLE_ROLES: readonly UserRole[] = [
  "ADMIN",
  "SUPERVISOR",
  "AGENT",
];

/** Rótulos legíveis das roles (para exibição no seletor). */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  SUPERVISOR: "Supervisor",
  AGENT: "Atendente",
  CUSTOMER: "Cliente",
  OMBUDSMAN: "Ouvidoria",
};
