/**
 * Camada de autorização (RBAC) do frontend.
 *
 * ⚠️ **Defense in depth, não segurança final.** Este mapa apenas espelha o RBAC
 * real do backend (`supportflow-backend/src/shared/security/rbac.ts` —
 * `ROLE_GROUPS`) para conduzir a UX (esconder/desabilitar ações). A segurança
 * de verdade é sempre aplicada pelo backend em cada request (401/403); o cliente
 * jamais deve ser considerado fonte confiável de autorização.
 *
 * Fonte da verdade (ROLE_GROUPS usados nas rotas):
 * - TICKET_LIST/TICKET_READ → ADMIN, SUPERVISOR, AGENT, CUSTOMER, OMBUDSMAN
 * - TICKET_CREATE           → ADMIN, SUPERVISOR, AGENT, CUSTOMER
 * - TICKET_STATUS (+OMBUDSMAN na rota /status) → ADMIN, SUPERVISOR, AGENT, OMBUDSMAN
 * - TICKET_ASSIGN           → ADMIN, SUPERVISOR
 * - METRICS                 → ADMIN, SUPERVISOR, AGENT
 * - ANALYTICS_READ (overview/status/priority/sla/agents) → ADMIN, SUPERVISOR
 * - CSAT_ANALYTICS          → ADMIN, SUPERVISOR, AGENT
 * - CUSTOMER_LIST           → ADMIN, SUPERVISOR, AGENT
 * - USERS_MANAGE (GET /users) → ADMIN (SUPER_ADMIN não existe neste tenant)
 * - USER_ADMIN / config     → ADMIN (SUPER_ADMIN não existe neste tenant)
 */
import type { UserRole } from "@/types/user";

export type Permission =
  | "dashboard:view"
  | "tickets:view"
  | "tickets:create"
  | "tickets:changeStatus"
  | "tickets:assign"
  | "tickets:comment"
  | "tickets:view-internal-comments"
  | "tickets:upload-attachment"
  | "tickets:view-attachments"
  | "metrics:view"
  | "analytics:view"
  | "analytics:csat"
  | "directory:view"
  | "users:list"
  | "notifications:view"
  | "audit:view"
  | "settings:access";

/** Roles autorizadas por permissão (espelho do RBAC do backend). */
export const PERMISSION_ROLES: Record<Permission, readonly UserRole[]> = {
  "dashboard:view": ["ADMIN", "SUPERVISOR", "AGENT"],
  "tickets:view": ["ADMIN", "SUPERVISOR", "AGENT", "CUSTOMER", "OMBUDSMAN"],
  "tickets:create": ["ADMIN", "SUPERVISOR", "AGENT", "CUSTOMER"],
  "tickets:changeStatus": ["ADMIN", "SUPERVISOR", "AGENT", "OMBUDSMAN"],
  "tickets:assign": ["ADMIN", "SUPERVISOR"],
  // Comentários internos (rota /tickets/{id}/comments no backend): visíveis e
  // criáveis apenas pela equipe de atendimento. CUSTOMER/OMBUDSMAN não têm
  // acesso (403 no backend).
  "tickets:view-internal-comments": ["ADMIN", "SUPERVISOR", "AGENT"],
  "tickets:comment": ["ADMIN", "SUPERVISOR", "AGENT"],
  // Anexos (rota /tickets/{id}/attachments no backend): a equipe envia/vê; o
  // CUSTOMER pode ver os anexos dos próprios chamados (GET libera CUSTOMER, mas
  // o POST é restrito à equipe — validado de verdade no backend).
  "tickets:upload-attachment": ["ADMIN", "SUPERVISOR", "AGENT"],
  "tickets:view-attachments": ["ADMIN", "SUPERVISOR", "AGENT", "CUSTOMER"],
  "metrics:view": ["ADMIN", "SUPERVISOR", "AGENT"],
  // analytics.read no backend: overview, tickets-by-status/priority, sla, agents.
  "analytics:view": ["ADMIN", "SUPERVISOR"],
  // CSAT_ANALYTICS no backend inclui AGENT.
  "analytics:csat": ["ADMIN", "SUPERVISOR", "AGENT"],
  "directory:view": ["ADMIN", "SUPERVISOR", "AGENT"],
  // GET /users exige USERS_MANAGE no backend → apenas ADMIN neste tenant.
  "users:list": ["ADMIN"],
  // GET /notifications: cada usuário vê apenas as próprias (qualquer role
  // autenticada). Só exige JWT no backend.
  "notifications:view": [
    "ADMIN",
    "SUPERVISOR",
    "AGENT",
    "CUSTOMER",
    "OMBUDSMAN",
  ],
  // GET /admin/audit-logs exige AUDIT_READ no backend → ADMIN e SUPERVISOR.
  "audit:view": ["ADMIN", "SUPERVISOR"],
  "settings:access": ["ADMIN"],
};

/** Verifica se a role possui uma permissão. Role ausente ⇒ negado. */
export function hasPermission(
  role: UserRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) return false;
  return PERMISSION_ROLES[permission].includes(role);
}

/** Possui ao menos uma das permissões. */
export function hasAnyPermission(
  role: UserRole | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/** Possui todas as permissões. */
export function hasAllPermissions(
  role: UserRole | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/** Lista todas as permissões concedidas a uma role. */
export function getRolePermissions(
  role: UserRole | null | undefined,
): Permission[] {
  return (Object.keys(PERMISSION_ROLES) as Permission[]).filter((permission) =>
    hasPermission(role, permission),
  );
}
