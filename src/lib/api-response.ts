import type { ApiErrorCode } from "./api-error";

/**
 * Contratos de resposta do backend SupportFlow (fonte da verdade: OpenAPI).
 *
 * IMPORTANTE: o backend é inconsistente quanto ao envelope. Alguns endpoints
 * retornam o envelope `ApiSuccessResponse`/`ApiPaginatedResponse`, outros
 * retornam o recurso "cru". Use os type guards e o helper `unwrap` para lidar
 * com ambos de forma segura. Ver docs/frontend-backend-integration.md.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    /** Backend usa `ApiErrorCode`; o BFF (route handlers) pode emitir códigos próprios. */
    code: ApiErrorCode | (string & {});
    message: string;
    details: unknown[];
  };
  requestId?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return isObject(value) && value.success === false && isObject(value.error);
}

export function isApiPaginatedResponse<T>(
  value: unknown,
): value is ApiPaginatedResponse<T> {
  return (
    isObject(value) &&
    value.success === true &&
    Array.isArray(value.data) &&
    isObject(value.meta)
  );
}

export function isApiSuccessResponse<T>(
  value: unknown,
): value is ApiSuccessResponse<T> {
  return (
    isObject(value) &&
    value.success === true &&
    "data" in value &&
    !("meta" in value)
  );
}

/**
 * Extrai o payload independentemente de o endpoint usar envelope ou não.
 * Útil enquanto o backend não padroniza o formato de resposta.
 */
export function unwrap<T>(payload: ApiSuccessResponse<T> | T): T {
  if (isApiSuccessResponse<T>(payload)) {
    return payload.data;
  }
  return payload as T;
}
