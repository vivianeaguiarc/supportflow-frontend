import { useQuery } from "@tanstack/react-query";

import { commentsService } from "../services";
import { commentsKeys } from "./comments-keys";

/** Lista de comentários internos de um ticket (`GET .../internal-comments`). */
export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: commentsKeys.list(ticketId),
    queryFn: () => commentsService.list(ticketId),
    enabled: Boolean(ticketId),
  });
}
