import { MutationCache } from "@tanstack/react-query";

import { notify } from "./notify";

/**
 * `MutationCache` global da aplicação: dispara os toasts de sucesso/erro a partir
 * do `meta` de cada mutation, centralizando o feedback. Extraído como fábrica
 * para ser compartilhado entre o `QueryProvider` de produção e o QueryClient de
 * teste — garantindo que os testes exercitem exatamente a mesma fiação.
 */
export function createAppMutationCache(): MutationCache {
  return new MutationCache({
    onSuccess: (data, _variables, _context, mutation) => {
      const meta = mutation.options.meta;
      if (!meta?.successMessage || meta.suppressSuccessToast) return;

      const message =
        typeof meta.successMessage === "function"
          ? meta.successMessage(data)
          : meta.successMessage;
      notify.success(message);
    },
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.meta?.suppressErrorToast) return;
      notify.apiError(error, mutation.options.meta?.errorMessage);
    },
  });
}
