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
