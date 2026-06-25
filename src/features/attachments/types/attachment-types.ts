/**
 * Tipos e constantes de domínio de anexos, reexportando os contratos canônicos
 * (`src/types/attachment.ts`) e centralizando as regras de validação espelhadas
 * do backend (`POST /tickets/{id}/attachments`).
 */
export type {
  TicketAttachment,
  TicketAttachmentWithUploader,
  UserSummary,
} from "@/types/attachment";

/** Tamanho máximo aceito pelo backend: 10 MB. */
export const ATTACHMENT_MAX_SIZE_BYTES = 10 * 1024 * 1024;

/** Extensões permitidas pelo backend. */
export const ATTACHMENT_ALLOWED_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
] as const;

/** Tipos MIME permitidos pelo backend (`.jpg`/`.jpeg` → `image/jpeg`). */
export const ATTACHMENT_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
] as const;

/** Valor do atributo `accept` do input de arquivo. */
export const ATTACHMENT_ACCEPT = [
  ...ATTACHMENT_ALLOWED_EXTENSIONS,
  ...ATTACHMENT_ALLOWED_MIME_TYPES,
].join(",");

/** Rótulo amigável dos formatos aceitos (para hints de UI). */
export const ATTACHMENT_ALLOWED_LABEL = "PDF, PNG, JPG ou JPEG (até 10 MB)";

/**
 * Valida um arquivo no cliente antes do upload, espelhando as regras do backend
 * (tipo + tamanho). Retorna uma mensagem amigável quando inválido, ou `null`.
 */
export function validateAttachmentFile(file: File): string | null {
  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = ATTACHMENT_ALLOWED_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext),
  );
  const hasAllowedMime = (
    ATTACHMENT_ALLOWED_MIME_TYPES as readonly string[]
  ).includes(file.type);

  // Alguns navegadores não preenchem `type`; aceitamos por extensão também.
  if (!hasAllowedExtension && !hasAllowedMime) {
    return `Formato não permitido. Aceitos: ${ATTACHMENT_ALLOWED_LABEL}.`;
  }

  if (file.size > ATTACHMENT_MAX_SIZE_BYTES) {
    return "Arquivo muito grande. O tamanho máximo é 10 MB.";
  }

  return null;
}

/** Formata bytes (recebidos como string do backend) em rótulo legível. */
export function formatFileSize(bytes: string | number): string {
  const value = typeof bytes === "string" ? Number(bytes) : bytes;
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value < 1024) return `${value} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}
