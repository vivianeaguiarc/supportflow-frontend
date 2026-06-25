import "@tanstack/react-query";

/**
 * Metadados tipados por mutation, lidos pela camada global do React Query
 * (`MutationCache` no `QueryProvider`) para disparar toasts de forma
 * centralizada — as mutations só declaram a intenção, sem repetir código de
 * feedback nas páginas.
 */
export interface AppMutationMeta extends Record<string, unknown> {
  /** Mensagem (ou fábrica a partir do retorno) de sucesso. */
  successMessage?: string | ((data: unknown) => string);
  /** Fallback para o toast de erro global. */
  errorMessage?: string;
  /** Desativa o toast de erro global (ex.: erro exibido inline no formulário). */
  suppressErrorToast?: boolean;
  /** Desativa o toast de sucesso global. */
  suppressSuccessToast?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: AppMutationMeta;
  }
}
