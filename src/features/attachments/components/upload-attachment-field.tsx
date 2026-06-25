"use client";

import { Loader2, Paperclip, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { useUploadTicketAttachment } from "../hooks";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_ALLOWED_LABEL,
  formatFileSize,
  validateAttachmentFile,
} from "../types";

interface UploadAttachmentFieldProps {
  ticketId: string;
}

/**
 * Campo de upload de anexo: seleção de arquivo + validação client-side (tipo e
 * tamanho, espelhando o backend) + envio via `multipart/form-data`. Em caso de
 * sucesso, limpa o campo (o toast é disparado centralmente pela mutation).
 */
export function UploadAttachmentField({
  ticketId,
}: UploadAttachmentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, isError, errorMessage } =
    useUploadTicketAttachment(ticketId);

  function resetField() {
    setFile(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      resetField();
      return;
    }

    const error = validateAttachmentFile(selected);
    if (error) {
      setValidationError(error);
      setFile(null);
      return;
    }

    setValidationError(null);
    setFile(selected);
  }

  function handleUpload() {
    if (!file) return;
    mutate(file, { onSuccess: resetField });
  }

  const message = validationError ?? (isError ? errorMessage : null);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ATTACHMENT_ACCEPT}
        className="sr-only"
        aria-label="Selecionar arquivo para anexar"
        onChange={handleChange}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip className="size-4" />
          Selecionar arquivo
        </Button>

        {file ? (
          <span
            className="max-w-[16rem] truncate text-sm text-muted-foreground"
            title={file.name}
          >
            {file.name} ({formatFileSize(file.size)})
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {ATTACHMENT_ALLOWED_LABEL}
          </span>
        )}

        <Button
          type="button"
          size="sm"
          className="ml-auto"
          disabled={!file || isPending}
          onClick={handleUpload}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Enviar
            </>
          )}
        </Button>
      </div>

      {message ? (
        <p className="text-sm text-destructive" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
