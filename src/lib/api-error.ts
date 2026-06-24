/**
 * Códigos de erro padronizados pelo backend (schema `ApiErrorResponse.error.code`).
 * Fonte da verdade: OpenAPI do supportflow-backend.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "UNIQUE_CONSTRAINT_VIOLATION"
  | "INTERNAL_SERVER_ERROR";

/**
 * Erro normalizado de API consumido pela UI.
 *
 * Encapsula o status HTTP, o `code` de negócio do backend, os `details` de
 * validação e o `requestId` para rastreamento (correlação com logs do backend).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown,
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

const FRIENDLY_MESSAGES: Partial<Record<ApiErrorCode, string>> = {
  VALIDATION_ERROR: "Verifique os dados informados e tente novamente.",
  BAD_REQUEST: "Não foi possível processar a requisição.",
  UNAUTHORIZED: "Sua sessão expirou. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para realizar esta ação.",
  RESOURCE_NOT_FOUND: "Recurso não encontrado.",
  UNIQUE_CONSTRAINT_VIOLATION: "Já existe um registro com esses dados.",
  INTERNAL_SERVER_ERROR:
    "Erro interno no servidor. Tente novamente em instantes.",
};

/**
 * Normaliza qualquer erro em uma mensagem amigável para a UI, mapeando os
 * códigos de negócio do backend quando disponíveis.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Algo deu errado. Tente novamente.",
): string {
  if (error instanceof ApiError) {
    const friendly = error.code
      ? FRIENDLY_MESSAGES[error.code as ApiErrorCode]
      : undefined;
    return friendly ?? error.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
