import { z } from "zod";

import { COMMENT_VISIBILITY_VALUES } from "../types";

/**
 * Schema do formulário de comentário.
 *
 * `content` espelha 1:1 o DTO real (`CreateCommentRequest`): 1–5000 caracteres.
 * `visibility` existe apenas no formulário para evolução futura — o backend só
 * aceita `INTERNAL` hoje, então o seletor é renderizado somente "quando
 * permitido" (mais de uma visibilidade) e o valor não é enviado no POST.
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva um comentário.")
    .max(5000, "O comentário deve ter no máximo 5.000 caracteres."),
  visibility: z.enum(COMMENT_VISIBILITY_VALUES),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
