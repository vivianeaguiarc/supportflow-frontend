import { useQuery } from "@tanstack/react-query";

import { attachmentsService } from "../services";
import { attachmentsKeys } from "./attachments-keys";

/** Lista de anexos de um ticket (`GET /tickets/{id}/attachments`). */
export function useTicketAttachments(ticketId: string) {
  return useQuery({
    queryKey: attachmentsKeys.list(ticketId),
    queryFn: () => attachmentsService.list(ticketId),
    enabled: Boolean(ticketId),
  });
}
