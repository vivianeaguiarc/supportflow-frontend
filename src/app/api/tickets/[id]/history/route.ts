import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/{id}/history`. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/history`);
}
