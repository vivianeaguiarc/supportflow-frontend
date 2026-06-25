"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider do React Query para toda a aplicação. Instancia um único
 * `QueryClient` por sessão de cliente (via `useState`), evitando recriação a
 * cada render e o compartilhamento de cache entre requisições no servidor.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
