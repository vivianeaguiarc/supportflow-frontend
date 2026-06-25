import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/{id}/comments` (comentários internos; RBAC no backend). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/comments`);
}

/** BFF: `POST /tickets/{id}/comments`. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.text();

  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
