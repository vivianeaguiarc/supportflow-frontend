/**
 * Contratos do módulo de Auditoria (trilha imutável).
 *
 * Fonte da verdade: backend `supportflow-backend`
 * - `GET /admin/audit-logs`        → `AuditAdminService.list` (`AuditLogView` + paginação)
 * - `GET /admin/audit-logs/verify` → `AuditAdminService.verify` (`AuditIntegrityVerificationView`)
 * - Schema Prisma `AuditLog`, DTO `listAuditLogsQuerySchema` e enums
 *   `AuditAction` / `AuditEntity`.
 *
 * Mantemos a convenção dos demais contratos em `@/features/<feature>/types`.
 */
import type { ApiPaginatedResponse } from "@/types/api";

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
  /** Endereço IP de origem (extraído de `metadata` quando coletado). */
  ip: string | null;
  /** Correlação de request (extraído de `metadata` quando coletado). */
  requestId: string | null;
  oldValues: unknown;
  newValues: unknown;
  metadata: unknown;
  previousHash: string | null;
  hash: string;
  createdAt: string;
}

/** Campos ordenáveis aceitos pelo backend (`AUDIT_LOG_SORT_FIELDS`). */
export const AUDIT_LOG_SORT_FIELDS = [
  "sequence",
  "createdAt",
  "action",
  "entity",
  "userId",
  "organizationId",
] as const;

export type AuditLogSortField = (typeof AUDIT_LOG_SORT_FIELDS)[number];

/** Query params reais aceitos por `GET /admin/audit-logs`. */
export interface ListAuditLogsParams {
  organizationId?: string;
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  /** Busca textual (ação, entidade, ids, ip/requestId em metadata). */
  search?: string;
  /** Início do período (ISO date string). */
  createdFrom?: string;
  /** Fim do período (ISO date string). */
  createdTo?: string;
  sortBy?: AuditLogSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/** Resposta paginada de `GET /admin/audit-logs` (envelope padrão com `meta`). */
export type AuditLogListResult = ApiPaginatedResponse<AuditLogEntry>;

/** Status de integridade da cadeia (campo `status` de `verify`). */
export type AuditIntegrityStatus = "INTACT" | "EMPTY" | "COMPROMISED";

/** Payload (já desembrulhado) de `GET /admin/audit-logs/verify`. */
export interface AuditChainVerification {
  status: AuditIntegrityStatus;
  totalLogs: number;
  checkedAt: string;
  firstLogId: string | null;
  lastLogId: string | null;
  compromisedLogId: string | null;
  message: string;
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
