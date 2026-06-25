"use client";

import { ExternalLink, FileText, ImageIcon, Paperclip } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getErrorMessage } from "@/lib/api-error";

import { useTicketAttachments } from "../hooks";
import { attachmentsService } from "../services";
import type { TicketAttachmentWithUploader } from "../types";
import { formatFileSize } from "../types";

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function iconFor(mimeType: string) {
  if (mimeType === "application/pdf") return FileText;
  if (mimeType.startsWith("image/")) return ImageIcon;
  return Paperclip;
}

interface AttachmentListProps {
  ticketId: string;
}

/** Lista de anexos do ticket com estados de carregamento/erro/vazio. */
export function AttachmentList({ ticketId }: AttachmentListProps) {
  const { data, isLoading, isError, error, refetch } =
    useTicketAttachments(ticketId);

  if (isLoading) {
    return <LoadingState label="Carregando anexos..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar os anexos"
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={() => refetch()}
      />
    );
  }

  const attachments = data ?? [];

  if (attachments.length === 0) {
    return (
      <EmptyState
        icon={Paperclip}
        title="Nenhum anexo ainda"
        description="Os arquivos enviados a este chamado aparecerão aqui."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {attachments.map((attachment: TicketAttachmentWithUploader) => {
        const Icon = iconFor(attachment.mimeType);
        const href = attachmentsService.downloadHref(ticketId, attachment.id);

        return (
          <li
            key={attachment.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            <Icon
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />

            <div className="min-w-0 flex-1">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-medium text-foreground hover:underline"
                title={attachment.originalName}
              >
                {attachment.originalName}
              </a>
              <p className="truncate text-xs text-muted-foreground">
                {formatFileSize(attachment.size)}
                {" · "}
                {attachment.uploadedBy?.name ?? "Equipe"}
                {" · "}
                {formatDateTime(attachment.createdAt)}
              </p>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ${attachment.originalName}`}
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <ExternalLink className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
