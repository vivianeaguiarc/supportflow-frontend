import { refreshAccessToken } from "@/lib/auth/refresh-client";
import { config } from "@/lib/config";
import { ApiError, isApiErrorResponse } from "@/types/api";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Quando true, chama um route handler local (BFF) em vez do backend. */
  local?: boolean;
  /** Quando true, não tenta renovar a sessão automaticamente em caso de 401. */
  skipAuthRefresh?: boolean;
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

async function parseError(response: Response): Promise<ApiError> {
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

  // Em desenvolvimento, nunca escondemos erros importantes da API.
  if (process.env.NODE_ENV !== "production") {
    console.error(`[httpClient] ${response.status} ${response.url}`, {
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
    headers,
    ...init
  } = options;

  const url = resolveUrl(path, params, local);

  const execute = async (): Promise<Response> => {
    const requestHeaders = new Headers(headers);
    requestHeaders.set("Accept", "application/json");

    if (body !== undefined) {
      requestHeaders.set("Content-Type", "application/json");
    }

    return fetch(url, {
      ...init,
      headers: requestHeaders,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
