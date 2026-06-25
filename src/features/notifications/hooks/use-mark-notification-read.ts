import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "@/lib/api-error";

import { notificationsService } from "../services";
import { notificationsKeys } from "./notifications-keys";

/**
 * Marca uma notificação como lida (`PATCH /notifications/{id}/read`).
 *
 * Sucesso silencioso (a UI já reflete o estado lido); apenas invalida as
 * listas de notificações para atualizar painel e contador.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    meta: { suppressSuccessToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
