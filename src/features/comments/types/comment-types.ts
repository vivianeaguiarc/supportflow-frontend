/**
 * Tipos e constantes de domínio de comentários, reexportando os contratos
 * canônicos (`src/types/comment.ts`) — fonte da verdade espelhada do OpenAPI.
 *
 * NOTA de contrato: o backend hoje só suporta `visibility: INTERNAL`
 * (`CommentVisibility` = `["INTERNAL"]` no OpenAPI; o `CreateCommentRequest`
 * aceita apenas `content`). As constantes abaixo são derivadas do enum real para
 * que a UI evolua automaticamente caso visibilidades públicas sejam adicionadas.
 */
import { type Tone } from "@/components/ui/constants";
import type { CommentVisibility } from "@/types/comment";

export type {
  CommentVisibility,
  CreateCommentRequest,
  TicketComment,
  TicketCommentWithAuthor,
  UserSummary,
} from "@/types/comment";

/** Visibilidades suportadas (derivadas do enum real do backend). */
export const COMMENT_VISIBILITY_VALUES = [
  "INTERNAL",
] as const satisfies readonly CommentVisibility[];

/** Metadados de exibição por visibilidade (rótulo + tom semântico). */
export const COMMENT_VISIBILITY_META: Record<
  CommentVisibility,
  { label: string; tone: Tone }
> = {
  INTERNAL: { label: "Interno", tone: "warning" },
};
