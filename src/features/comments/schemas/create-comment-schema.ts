import { z } from "zod";

/**
 * Schema do formulário de comentário — espelho 1:1 do DTO real do backend
 * (`CreateCommentRequest`): `content` obrigatório, 1–5000 caracteres.
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva um comentário.")
    .max(5000, "O comentário deve ter no máximo 5.000 caracteres."),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
