/**
 * Query keys de anexos. Hierarquia sob `["attachments"]` permite invalidar
 * todos ou apenas a lista de um ticket específico.
 */
export const attachmentsKeys = {
  all: ["attachments"] as const,
  list: (ticketId: string) =>
    [...attachmentsKeys.all, "list", ticketId] as const,
};
