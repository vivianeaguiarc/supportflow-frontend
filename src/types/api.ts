/**
 * Superfície pública dos contratos de infraestrutura da API.
 *
 * As definições canônicas vivem em `src/lib/api-error.ts` (erros) e
 * `src/lib/api-response.ts` (envelopes de resposta). Este barrel mantém o
 * import estável `@/types/api` para o restante da aplicação.
 */
export { ApiError, type ApiErrorCode } from "@/lib/api-error";
export {
  type ApiErrorResponse,
  type ApiPaginatedResponse,
  type ApiSuccessResponse,
  isApiErrorResponse,
  isApiPaginatedResponse,
  isApiSuccessResponse,
  type PaginationMeta,
  unwrap,
} from "@/lib/api-response";
