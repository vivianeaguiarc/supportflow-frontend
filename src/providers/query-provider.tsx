"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { createAppMutationCache } from "@/lib/notifications";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider do React Query para toda a aplicação. Instancia um único
 * `QueryClient` por sessão de cliente (via `useState`), evitando recriação a
 * cada render e o compartilhamento de cache entre requisições no servidor.
 *
 * Feedback centralizado: o `MutationCache` global dispara os toasts de
 * sucesso/erro a partir do `meta` de cada mutation — as páginas e hooks não
 * repetem código de notificação.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: createAppMutationCache(),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
