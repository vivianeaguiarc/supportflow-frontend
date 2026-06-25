import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "@/lib/api-error";
import { MESSAGES } from "@/lib/notifications";
import type { MarkAllNotificationsAsReadResponse } from "@/types/notification";

import { notificationsService } from "../services";
import { notificationsKeys } from "./notifications-keys";

/** Mensagem de sucesso a partir do `count` retornado pelo backend. */
function allReadSuccessMessage(data: unknown): string {
  return MESSAGES.notification.allRead(
    (data as MarkAllNotificationsAsReadResponse).count,
  );
}

/**
 * Marca todas as notificações como lidas (`PATCH /notifications/read-all`).
 * Toast de sucesso com a contagem; invalida as listas de notificações.
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    meta: { successMessage: allReadSuccessMessage },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
