let refreshPromise: Promise<boolean> | null = null;

/**
 * Renova o access token chamando o route handler BFF.
 * Usa single-flight para que múltiplas requisições 401 simultâneas
 * compartilhem uma única chamada de refresh.
 */
export function refreshAccessToken(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
