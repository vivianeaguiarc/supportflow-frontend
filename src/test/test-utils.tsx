import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { type MockInstance, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "@/features/auth/contexts";
import { createAppMutationCache, notify } from "@/lib/notifications";
import { ApiError } from "@/types/api";
import type { AuthUser, UserRole } from "@/types/auth";

/**
 * QueryClient isolado por teste, sem retry/cache persistente. Inclui o mesmo
 * `MutationCache` de produção para que os testes exercitem a fiação real de
 * notificações (toasts disparados via `meta` da mutation).
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    mutationCache: createAppMutationCache(),
    defaultOptions: {
      // gcTime: Infinity preserva escritas de cache (setQueryData) sem observers
      // ativos — o isolamento entre testes vem do client descartável, não do GC.
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

/**
 * Wrapper mínimo de React Query para `renderHook` — provê um QueryClient isolado
 * e o devolve para inspeção (ex.: espiar `invalidateQueries`).
 */
export function createQueryWrapper(
  queryClient: QueryClient = createTestQueryClient(),
) {
  function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return { wrapper: QueryWrapper, queryClient };
}

/** Cria um `ApiError` realista para simular falhas da camada de service. */
export function mockApiError(
  status = 500,
  message = "Erro simulado pela suíte de testes.",
  code?: string,
): ApiError {
  return new ApiError(message, status, code);
}

export interface NotificationSpies {
  success: MockInstance<typeof notify.success>;
  error: MockInstance<typeof notify.error>;
  apiError: MockInstance<typeof notify.apiError>;
}

/**
 * Espiona a camada global de notificações (`notify`). Como o `MutationCache`
 * chama `notify.*`, isso permite asserções sobre os toasts sem renderizar o
 * Sonner. Restaure com `vi.restoreAllMocks()` no `afterEach`.
 */
export function mockNotificationService(): NotificationSpies {
  return {
    success: vi.spyOn(notify, "success").mockReturnValue("toast-id"),
    error: vi.spyOn(notify, "error").mockReturnValue("toast-id"),
    apiError: vi.spyOn(notify, "apiError").mockReturnValue("toast-id"),
  };
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
