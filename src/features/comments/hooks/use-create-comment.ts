import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ticketsKeys } from "@/features/tickets/hooks";
import { getErrorMessage } from "@/lib/api-error";
import { MESSAGES } from "@/lib/notifications";
import type { CreateCommentRequest } from "@/types/comment";

import { commentsService } from "../services";
import { commentsKeys } from "./comments-keys";

/**
 * Cria um comentário interno (`POST .../internal-comments`).
 *
 * Em caso de sucesso invalida a lista de comentários e o histórico do ticket
 * (o backend gera um evento `COMMENT_ADDED`). O toast de sucesso é disparado
 * centralmente pelo `MutationCache` via `meta.successMessage`.
 */
export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateCommentRequest) =>
      commentsService.create(ticketId, payload),
    meta: { successMessage: MESSAGES.comment.added },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: commentsKeys.list(ticketId),
      });
      void queryClient.invalidateQueries({
        queryKey: ticketsKeys.history(ticketId),
      });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
