/**
 * Contratos de anexos de chamados.
 * Fonte da verdade: OpenAPI do supportflow-backend (tag "Ticket Attachments",
 * rota `/tickets/{id}/attachments`, schemas `TicketAttachment`,
 * `TicketAttachmentWithUploader`).
 */
import type { UserSummary } from "./user";

export type { UserSummary } from "./user";

/** Entidade `TicketAttachment` (recurso cru dentro do envelope). */
export interface TicketAttachment {
  id: string;
  ticketId: string;
  tenantId: string;
  uploadedById: string;
  /** Nome do arquivo no storage (com timestamp). */
  fileName: string;
  /** Nome original enviado pelo usuário. */
  originalName: string;
  mimeType: string;
  /** Tamanho em bytes — serializado como string (compat. BigInt no backend). */
  size: string;
  /** URL relativa do arquivo no storage local do backend (ex.: `/storage/...`). */
  fileUrl: string;
  createdAt: string;
}

/** Anexo com os dados resumidos de quem fez o upload (usado na listagem). */
export interface TicketAttachmentWithUploader extends TicketAttachment {
  uploadedBy?: UserSummary;
}
