/**
 * Camada pública de service de autenticação.
 *
 * A implementação canônica vive em `src/features/auth/services` (arquitetura por
 * features). Este módulo é o ponto de entrada estável citado na documentação de
 * integração (`src/services/auth.service.ts`).
 *
 * Métodos disponíveis em `authService`:
 * - `login({ email, password })` → autentica via BFF `/api/auth/login`.
 * - `getMe()` → recupera o usuário autenticado via BFF `/api/auth/me`.
 * - `logout()` → encerra a sessão via BFF `/api/auth/logout`.
 */
export { authService } from "@/features/auth/services";
