import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { config } from "@/lib/config";
import { unwrap } from "@/types/api";
import type { TicketAttachmentWithUploader } from "@/types/attachment";

/**
 * BFF: abre/baixa um anexo de forma autenticada.
 *
 * O backend não expõe um endpoint REST de download — apenas um `fileUrl`
 * relativo ao storage. Para manter a autenticação por cookie HttpOnly e evitar
 * SSRF, resolvemos o `fileUrl` a partir da própria listagem (via `attachmentId`)
 * e então fazemos stream do binário do storage com o Bearer injetado.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; attachmentId: string }> },
) {
  const { id, attachmentId } = await params;

  const listResponse = await backendFetch(
    `/tickets/${encodeURIComponent(id)}/attachments`,
  );

  if (!listResponse.ok) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPSTREAM_ERROR",
          message: "Falha ao localizar o anexo.",
          details: [],
        },
      },
      { status: listResponse.status },
    );
  }

  const payload = (await listResponse.json()) as unknown;
  const attachments = unwrap<TicketAttachmentWithUploader[]>(
    payload as TicketAttachmentWithUploader[],
  );
  const attachment = Array.isArray(attachments)
    ? attachments.find((item) => item.id === attachmentId)
    : undefined;

  if (!attachment) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Anexo não encontrado.",
          details: [],
        },
      },
      { status: 404 },
    );
  }

  // `fileUrl` é relativo à origem do backend (fora do prefixo `/api`).
  const origin = new URL(config.apiUrl).origin;
  const fileUrl = attachment.fileUrl.startsWith("/")
    ? attachment.fileUrl
    : `/${attachment.fileUrl}`;
  const accessToken = await getAccessTokenCookie();

  const fileResponse = await fetch(`${origin}${fileUrl}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });

  if (!fileResponse.ok || !fileResponse.body) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPSTREAM_ERROR",
          message: "Não foi possível baixar o arquivo.",
          details: [],
        },
      },
      { status: 502 },
    );
  }

  const safeName = attachment.originalName.replace(/["\r\n]/g, "");
  const headers = new Headers();
  headers.set(
    "Content-Type",
    attachment.mimeType ||
      fileResponse.headers.get("content-type") ||
      "application/octet-stream",
  );
  headers.set("Content-Disposition", `inline; filename="${safeName}"`);
  headers.set("Cache-Control", "private, no-store");

  return new NextResponse(fileResponse.body, { status: 200, headers });
}
