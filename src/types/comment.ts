/**
 * Contratos de comentários de chamados.
 * Fonte da verdade: OpenAPI do supportflow-backend (tag "Ticket Comments",
 * rota `/tickets/{id}/comments`, schemas `TicketComment`,
 * `TicketCommentWithAuthor`, `CreateCommentRequest`, `CommentVisibility`).
 *
 * NOTA: hoje o backend só suporta comentários INTERNOS (visíveis a
 * ADMIN/SUPERVISOR/AGENT — o cliente não tem acesso). O enum `CommentVisibility`
 * existe para evolução futura (ex.: comentários públicos).
 */
import type { UserSummary } from "./user";

export type { UserSummary } from "./user";

/** Visibilidade do comentário — atualmente todos são internos. */
export type CommentVisibility = "INTERNAL";

/** Entidade `TicketComment` (recurso cru dentro do envelope). */
export interface TicketComment {
  id: string;
  ticketId: string;
  tenantId: string;
  authorId: string;
  content: string;
  visibility: CommentVisibility;
  createdAt: string;
  updatedAt: string;
}

/** Comentário com os dados resumidos do autor (usado na listagem). */
export interface TicketCommentWithAuthor extends TicketComment {
  author?: UserSummary;
}

/** Body de `POST /tickets/{ticketId}/comments`. */
export interface CreateCommentRequest {
  /** Conteúdo do comentário (1–5000 caracteres). */
  content: string;
}
