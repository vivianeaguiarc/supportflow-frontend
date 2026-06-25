/**
 * Contratos do módulo de Auditoria (trilha imutável).
 *
 * Fonte da verdade: backend `supportflow-backend`
 * - `GET /admin/audit-logs`        → `AuditAdminService.list` (`AuditLogView`)
 * - `GET /admin/audit-logs/verify` → `AuditAdminService.verify` (`AuditChainVerification`)
 * - Schema Prisma `AuditLog` e enums `AuditAction` / `AuditEntity`.
 *
 * ⚠️ O OpenAPI não publica o schema da resposta da listagem (apenas "lista
 * paginada"); estes tipos espelham a implementação real do backend. Mantemos a
 * convenção dos demais contratos em `@/features/<feature>/types`.
 */

/**
 * Registro imutável da trilha de auditoria (espelho de `AuditLogView`).
 * `sequence`/`previousHash`/`hash` compõem a cadeia encadeada (append-only).
 */
export interface AuditLogEntry {
  id: string;
  /** Posição na cadeia (BigInt serializado como string). */
  sequence: string;
  /** Tenant/organização (pode ser nulo para eventos de sistema/globais). */
  organizationId: string | null;
  /** Autor da ação; nulo quando originada pelo sistema. */
  userId: string | null;
  /** Identificador canônico da ação (ex.: `ticket.status_changed`). */
  action: string;
  /** Tipo da entidade afetada (ex.: `ticket`, `user`). */
  entity: string;
  /** Id do recurso afetado (ex.: id do ticket); pode ser nulo. */
  entityId: string | null;
  oldValues: unknown;
  newValues: unknown;
  metadata: unknown;
  previousHash: string | null;
  hash: string;
  createdAt: string;
}

/** Query params reais aceitos por `GET /admin/audit-logs`. */
export interface ListAuditLogsParams {
  organizationId?: string;
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  page?: number;
  limit?: number;
}

/** Payload (já desembrulhado) de `GET /admin/audit-logs`. */
export interface AuditLogListResult {
  data: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export type AuditChainStatus = "VALID" | "BROKEN" | "EMPTY";

/** Payload (já desembrulhado) de `GET /admin/audit-logs/verify`. */
export interface AuditChainVerification {
  status: AuditChainStatus;
  valid: boolean;
  totalVerified: number;
  firstInvalid: unknown | null;
}

/**
 * Ações canônicas (`AuditAction` do backend) → rótulo legível pt-BR.
 * Usado para a coluna de ação e para o filtro por tipo de ação.
 */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "auth.login_failed": "Falha de login",
  "auth.login_locked": "Conta bloqueada",
  "access.denied": "Acesso negado",
  "api_key.created": "API key criada",
  "api_key.revoked": "API key revogada",
  "user.permission_assigned": "Permissão atribuída",
  "role.created": "Papel criado",
  "role.updated": "Papel atualizado",
  "role.deleted": "Papel removido",
  "role.permissions_updated": "Permissões do papel atualizadas",
  "ticket.created": "Chamado criado",
  "ticket.assigned": "Chamado atribuído",
  "ticket.status_changed": "Status alterado",
  "ticket.resolved": "Chamado resolvido",
  "ticket.closed": "Chamado fechado",
  "webhook.created": "Webhook criado",
  "webhook.updated": "Webhook atualizado",
  "webhook.deleted": "Webhook removido",
  "automation_rule.created": "Regra de automação criada",
  "automation_rule.updated": "Regra de automação atualizada",
  "automation_rule.deleted": "Regra de automação removida",
};

/** Entidades canônicas (`AuditEntity` do backend) → rótulo legível pt-BR. */
export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  auth: "Autenticação",
  authorization: "Autorização",
  api_key: "API key",
  user: "Usuário",
  role: "Papel",
  ticket: "Chamado",
  webhook: "Webhook",
  automation_rule: "Regra de automação",
};

/** Rótulo amigável de uma ação (cai no próprio código quando desconhecida). */
export function getAuditActionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action;
}

/** Rótulo amigável de uma entidade (cai no próprio código quando desconhecida). */
export function getAuditEntityLabel(entity: string): string {
  return AUDIT_ENTITY_LABELS[entity] ?? entity;
}

/** Opções (valor/rótulo) para os filtros de ação e entidade. */
export const AUDIT_ACTION_OPTIONS = Object.entries(AUDIT_ACTION_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const AUDIT_ENTITY_OPTIONS = Object.entries(AUDIT_ENTITY_LABELS).map(
  ([value, label]) => ({ value, label }),
);
