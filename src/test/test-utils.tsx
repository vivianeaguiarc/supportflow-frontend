import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

import { AuthContext, type AuthContextValue } from "@/features/auth/contexts";
import type { AuthUser, UserRole } from "@/types/auth";

/** QueryClient isolado por teste, sem retry/cache persistente. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

/** Fábrica de usuário autenticado para cenários de RBAC. */
export function makeUser(
  role: UserRole = "ADMIN",
  overrides: Partial<AuthUser> = {},
): AuthUser {
  return {
    id: "user-1",
    name: "Usuária de Teste",
    email: "teste@supportflow.dev",
    role,
    tenantId: "tenant-1",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function buildAuthValue(user: AuthUser | null): AuthContextValue {
  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
    refreshSession: vi.fn(async () => {}),
    logout: vi.fn(async () => {}),
  };
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Usuário autenticado injetado no `AuthContext` (null = deslogado). */
  user?: AuthUser | null;
  queryClient?: QueryClient;
}

/**
 * Renderiza com os providers globais mockados (React Query + AuthContext),
 * sem chamadas de rede — o `AuthContext` recebe um valor controlado.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    user = null,
    queryClient = createTestQueryClient(),
    ...options
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={buildAuthValue(user)}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

export * from "@testing-library/react";
export { userEvent };
