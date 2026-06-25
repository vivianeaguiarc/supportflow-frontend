/**
 * Re-export de compatibilidade. A implementação canônica do client HTTP vive em
 * `src/services/http/api-client.ts`. Mantido para imports existentes
 * (`@/services/http-client`).
 */
export { apiClient, httpClient, type RequestOptions } from "./http/api-client";
