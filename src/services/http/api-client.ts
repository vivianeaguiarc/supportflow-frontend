import { refreshAccessToken } from "@/lib/auth/refresh-client";
import { config } from "@/lib/config";
import { ApiError, isApiErrorResponse } from "@/types/api";

/**
 * Client HTTP centralizado do SupportFlow.
 *
 * Camada equivalente a interceptors:
 * - **Bearer Token:** o JWT de acesso vive em cookie HttpOnly e é injetado no
 *   header `Authorization: Bearer` pelo BFF do servidor
 *   (`src/lib/api/backend.ts`), mantendo o token fora do alcance do JS do
 *   cliente. No navegador, as requisições enviam `credentials: "include"`.
 * - **401:** intercepta, tenta `refreshAccessToken()` (single-flight) uma vez e
 *   refaz a request; se falhar, encerra a sessão.
 * - **Refresh token:** preparado/implementado via `/api/auth/refresh`.
 * - **Erros:** normaliza `ApiErrorResponse` em `ApiError` (status/code/details/
 *   requestId); use `getErrorMessage()` para mensagens de UI.
 */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Quando true, chama um route handler local (BFF) em vez do backend. */
  local?: boolean;
  /** Quando true, não tenta renovar a sessão automaticamente em caso de 401. */
  skipAuthRefresh?: boolean;
  /**
   * Status HTTP "esperados" para esta chamada (ex.: `[401]` no probe de sessão
   * `GET /auth/me`). Suprime apenas o log de erro de desenvolvimento — o erro
   * continua sendo lançado normalmente para quem chamou tratar.
   */
  expectedErrorStatuses?: number[];
}

function appendParams(url: string, params?: RequestOptions["params"]): string {
  if (!params) return url;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

function resolveUrl(
  path: string,
  params: RequestOptions["params"],
  local: boolean,
): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = local ? normalized : `${config.apiUrl}${normalized}`;
  return appendParams(base, params);
}

async function parseError(
  response: Response,
  expectedErrorStatuses?: number[],
): Promise<ApiError> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    // Corpo da resposta não é JSON (ex.: 502/timeout).
  }

  const error = isApiErrorResponse(payload)
    ? new ApiError(
        payload.error.message,
        response.status,
        payload.error.code,
        payload.error.details,
        payload.requestId,
      )
    : new ApiError(
        response.statusText || "Erro inesperado na requisição.",
        response.status,
      );

  // Em desenvolvimento, logamos erros importantes da API — exceto status
  // marcados como esperados pelo chamador (ex.: 401 do probe de sessão).
  const isExpected = expectedErrorStatuses?.includes(response.status) ?? false;
  if (process.env.NODE_ENV !== "production" && !isExpected) {
    console.error(`[apiClient] ${response.status} ${response.url}`, {
      code: error.code,
      message: error.message,
      details: error.details,
      requestId: error.requestId,
    });
  }

  return error;
}

export async function httpClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    body,
    params,
    local = false,
    skipAuthRefresh = false,
    expectedErrorStatuses,
    headers,
    ...init
  } = options;

  const url = resolveUrl(path, params, local);

  // Uploads usam `multipart/form-data`: não serializamos como JSON e deixamos o
  // navegador definir o `Content-Type` com o boundary correto.
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const execute = async (): Promise<Response> => {
    const requestHeaders = new Headers(headers);
    requestHeaders.set("Accept", "application/json");

    if (body !== undefined && !isFormData) {
      requestHeaders.set("Content-Type", "application/json");
    }

    return fetch(url, {
      ...init,
      headers: requestHeaders,
      credentials: "include",
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  };

  let response = await execute();

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    typeof window !== "undefined"
  ) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await execute();
    } else {
      // Refresh falhou: encerra a sessão de forma segura limpando os cookies.
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => undefined);
    }
  }

  if (!response.ok) {
    throw await parseError(response, expectedErrorStatuses);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

type BodyOptions = Omit<RequestOptions, "method" | "body">;
type NoBodyOptions = Omit<RequestOptions, "method" | "body">;

/**
 * Açúcar sintático sobre `httpClient` por verbo HTTP. Útil para a camada de
 * services. Todos os métodos compartilham os mesmos interceptors (401/refresh,
 * normalização de erro e envio de cookies).
 */
export const apiClient = {
  get: <T>(path: string, options?: NoBodyOptions) =>
    httpClient<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: BodyOptions) =>
    httpClient<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: BodyOptions) =>
    httpClient<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: BodyOptions) =>
    httpClient<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: NoBodyOptions) =>
    httpClient<T>(path, { ...options, method: "DELETE" }),
} as const;
