/**
 * Hooks públicos de autenticação (React Query + contexto de sessão).
 *
 * Implementação canônica em `src/features/auth/hooks` e `contexts`:
 * - `useAuth()` → estado da sessão (`user`, `isAuthenticated`, `isLoading`,
 *   `refreshSession`, `logout`).
 * - `useLogin()` → mutation de login.
 * - `useMe()` → query do usuário autenticado (`GET /auth/me`).
 */
export {
  AUTH_ME_QUERY_KEY,
  useAuth,
  useLogin,
  useMe,
} from "@/features/auth/hooks";
