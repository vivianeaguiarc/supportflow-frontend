/**
 * Query keys de comentários. Hierarquia sob `["comments"]` permite invalidar
 * todos ou apenas a lista de um ticket específico.
 */
export const commentsKeys = {
  all: ["comments"] as const,
  list: (ticketId: string) => [...commentsKeys.all, "list", ticketId] as const,
};
