/**
 * Contratos do módulo de Configuração de SLA (somente leitura).
 *
 * Fonte da verdade: backend `supportflow-backend`.
 *
 * O backend **não expõe** um CRUD de "política de SLA". A configuração de SLA é
 * derivada de fontes reais distintas:
 * - `GET /tickets/sla` → `TicketSlaService.getSummaryForTenant` (`TicketSlaSummary`):
 *   indicadores operacionais agregados do tenant.
 * - `GET /ticket-categories` → `TicketCategoriesController.list` (`TicketCategory`):
 *   cada categoria carrega `slaHours` (alvo de SLA de resolução por categoria).
 * - `PRIORITY_SLA_HOURS` (constante de domínio em `ticket-sla.ts`): regra fixa de
 *   SLA por prioridade — **não exposta por nenhum endpoint** (apenas documentada).
 *
 * Lacunas conhecidas do backend (sem endpoint/campo correspondente):
 * tempo de **resposta** dedicado, **canais atendidos** e gestão (escrita) de SLA.
 */
import type { ApiPaginatedResponse } from "@/types/api";
import type { TicketCategory, TicketPriority } from "@/types/ticket";

/** Resumo de SLA do tenant (`GET /tickets/sla`, schema `TicketSlaSummary`). */
export interface SlaSummary {
  /** Chamados ativos dentro do prazo. */
  onTime: number;
  /** Chamados ativos próximos do vencimento (janela de alerta). */
  warning: number;
  /** Chamados ativos com SLA já violado. */
  breached: number;
  /** Total de chamados ativos considerados. */
  total: number;
}

/**
 * "Política de SLA" exibida na tela = uma categoria de chamado com seu alvo de
 * SLA (`slaHours`). É o recurso real mais próximo de uma política configurável.
 */
export type SlaPolicy = TicketCategory;

/** Campos ordenáveis aceitos por `GET /ticket-categories`. */
export const SLA_POLICY_SORT_FIELDS = ["name", "createdAt"] as const;
export type SlaPolicySortField = (typeof SLA_POLICY_SORT_FIELDS)[number];

/** Query params reais aceitos por `GET /ticket-categories`. */
export interface ListSlaPoliciesParams {
  search?: string;
  isActive?: boolean;
  sortBy?: SlaPolicySortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/** Resposta paginada de `GET /ticket-categories`. */
export type SlaPolicyListResult = ApiPaginatedResponse<SlaPolicy>;

/**
 * Referência de SLA por prioridade — espelho **somente leitura** da constante
 * `PRIORITY_SLA_HOURS` do backend. Regra fixa do domínio, não configurável por
 * API; exibida apenas para fins de documentação/transparência na UI.
 */
export interface SlaPriorityRule {
  priority: TicketPriority;
  hours: number;
}

export const PRIORITY_SLA_REFERENCE: readonly SlaPriorityRule[] = [
  { priority: "URGENT", hours: 2 },
  { priority: "HIGH", hours: 8 },
  { priority: "MEDIUM", hours: 24 },
  { priority: "LOW", hours: 72 },
];
