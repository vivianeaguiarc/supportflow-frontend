import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/{id}/attachments` (lista; RBAC validado no backend). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/attachments`);
}

/**
 * BFF: `POST /tickets/{id}/attachments` — upload `multipart/form-data`.
 *
 * Reencaminhamos o `FormData` ao backend sem fixar `Content-Type`: o fetch do
 * runtime gera o boundary multipart correto. O `backendFetch` injeta o Bearer.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();

  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/attachments`, {
    method: "POST",
    body: formData,
  });
}
