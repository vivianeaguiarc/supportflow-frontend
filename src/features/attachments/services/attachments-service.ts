import { httpClient } from "@/services/http-client";
import { unwrap } from "@/types/api";
import type {
  TicketAttachment,
  TicketAttachmentWithUploader,
} from "@/types/attachment";

/**
 * Camada de integração com os endpoints reais de anexos do ticket.
 *
 * Usa o grupo `/tickets/{id}/attachments`, passando pelos route handlers BFF
 * (`local: true`), que injetam o Bearer a partir do cookie HttpOnly. O upload é
 * enviado como `multipart/form-data` (campo `file`); as respostas são
 * desembrulhadas com `unwrap()`.
 */
export const attachmentsService = {
  /** `GET /tickets/{id}/attachments` — lista cronológica com o autor do upload. */
  async list(ticketId: string): Promise<TicketAttachmentWithUploader[]> {
    const response = await httpClient<TicketAttachmentWithUploader[]>(
      `/api/tickets/${encodeURIComponent(ticketId)}/attachments`,
      { local: true },
    );
    return unwrap<TicketAttachmentWithUploader[]>(response);
  },

  /** `POST /tickets/{id}/attachments` — upload multipart (campo `file`). */
  async upload(ticketId: string, file: File): Promise<TicketAttachment> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient<TicketAttachment>(
      `/api/tickets/${encodeURIComponent(ticketId)}/attachments`,
      { method: "POST", body: formData, local: true },
    );
    return unwrap<TicketAttachment>(response);
  },

  /** URL (BFF) para abrir/baixar um anexo com autenticação via cookie. */
  downloadHref(ticketId: string, attachmentId: string): string {
    return `/api/tickets/${encodeURIComponent(ticketId)}/attachments/${encodeURIComponent(attachmentId)}/download`;
  },
};

export type AttachmentsService = typeof attachmentsService;
