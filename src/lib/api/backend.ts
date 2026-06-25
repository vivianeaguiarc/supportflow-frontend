import { NextResponse } from "next/server";

import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { config } from "@/lib/config";

/**
 * Fetch autenticado executado no servidor (route handlers / BFF).
 *
 * Lê o access token do cookie HttpOnly e o envia ao backend como Bearer,
 * mantendo o token fora do alcance do JavaScript do cliente. A resposta do
 * backend (incluindo status 401) é repassada sem alteração para que o
 * http-client do cliente possa acionar o fluxo de refresh quando necessário.
 */
export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = await getAccessTokenCookie();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${config.apiUrl}${normalized}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

/**
 * Encaminha (proxy) uma requisição autenticada do route handler BFF para o
 * backend, preservando status e corpo originais (envelope ou recurso cru).
 */
export async function proxyToBackend(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const response = await backendFetch(path, init);

  // Status sem corpo (ex.: 204 No Content) não podem carregar body — construir
  // um NextResponse com body não-nulo nesses casos lança em runtime.
  if (
    response.status === 204 ||
    response.status === 205 ||
    response.status === 304
  ) {
    return new NextResponse(null, { status: response.status });
  }

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
