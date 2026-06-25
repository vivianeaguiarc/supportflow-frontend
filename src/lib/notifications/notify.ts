import { type ExternalToast, toast } from "sonner";

import { getErrorMessage } from "@/lib/api-error";
import { ApiError } from "@/types/api";

import { MESSAGES } from "./messages";

type ToastOptions = ExternalToast;
type ToastId = string | number;

interface PromiseMessages<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
}

/**
 * Resolve qualquer erro (ApiError, falha de rede, Error genérico) em uma
 * mensagem amigável e padronizada para a UI.
 */
export function resolveErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof ApiError) {
    if (error.status === 403) return MESSAGES.error.forbidden;
    return getErrorMessage(error, fallback ?? MESSAGES.error.generic);
  }

  // `fetch` lança TypeError quando não há conexão / servidor inacessível.
  if (error instanceof TypeError) return MESSAGES.error.network;

  return getErrorMessage(error, fallback ?? MESSAGES.error.generic);
}

/**
 * Camada única de notificações da aplicação (abstração sobre o Sonner).
 *
 * As páginas/hooks NÃO devem importar `sonner` diretamente — sempre usar
 * `notify.*`. Isso centraliza tom, acessibilidade e a troca futura da lib.
 */
export const notify = {
  success(message: string, options?: ToastOptions): ToastId {
    return toast.success(message, options);
  },
  error(message: string, options?: ToastOptions): ToastId {
    return toast.error(message, options);
  },
  warning(message: string, options?: ToastOptions): ToastId {
    return toast.warning(message, options);
  },
  info(message: string, options?: ToastOptions): ToastId {
    return toast.info(message, options);
  },
  /** Toast de erro a partir de um erro de API/rede já normalizado. */
  apiError(error: unknown, fallback?: string): ToastId {
    return toast.error(resolveErrorMessage(error, fallback));
  },
  /** Toast atrelado ao ciclo de vida de uma promise (loading → success/error). */
  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>) {
    return toast.promise(promise, messages);
  },
  dismiss(id?: ToastId): void {
    toast.dismiss(id);
  },
} as const;
