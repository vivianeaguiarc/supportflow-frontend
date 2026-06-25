import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ticketsKeys } from "@/features/tickets/hooks";
import { getErrorMessage } from "@/lib/api-error";
import { MESSAGES } from "@/lib/notifications";

import { attachmentsService } from "../services";
import { attachmentsKeys } from "./attachments-keys";

/**
 * Faz upload de um anexo (`POST /tickets/{id}/attachments`, multipart).
 *
 * Em caso de sucesso invalida a lista de anexos e o histórico do ticket (o
 * backend gera um evento `ATTACHMENT_ADDED`). O toast de sucesso é disparado
 * centralmente pelo `MutationCache` via `meta.successMessage`; erros são
 * tratados por `ApiError` + `getErrorMessage()` (exposto como `errorMessage`).
 */
export function useUploadTicketAttachment(ticketId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => attachmentsService.upload(ticketId, file),
    meta: { successMessage: MESSAGES.attachment.uploaded },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: attachmentsKeys.list(ticketId),
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
