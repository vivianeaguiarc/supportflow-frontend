import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";
import type {
  CreateCommentRequest,
  TicketComment,
  TicketCommentWithAuthor,
} from "@/types/comment";

/**
 * Camada de integração com os endpoints reais de comentários internos.
 *
 * Usa o grupo `/tickets/{id}/internal-comments` (ADMIN/SUPERVISOR/AGENT),
 * passando pelos route handlers BFF (`local: true`), que injetam o Bearer a
 * partir do cookie HttpOnly. As respostas são desembrulhadas com `unwrap()`.
 */
export const commentsService = {
  /** `GET /tickets/{id}/internal-comments` — lista com dados do autor. */
  async list(ticketId: string): Promise<TicketCommentWithAuthor[]> {
    const response = await httpClient<TicketCommentWithAuthor[]>(
      `/api/tickets/${encodeURIComponent(ticketId)}/internal-comments`,
      { local: true },
    );
    return unwrap<TicketCommentWithAuthor[]>(response);
  },

  /** `POST /tickets/{id}/internal-comments` — cria um comentário. */
  async create(
    ticketId: string,
    payload: CreateCommentRequest,
  ): Promise<TicketComment> {
    const response = await httpClient<TicketComment>(
      `/api/tickets/${encodeURIComponent(ticketId)}/internal-comments`,
      { method: "POST", body: payload, local: true },
    );
    return unwrap<TicketComment>(response);
  },
};

export type CommentsService = typeof commentsService;
