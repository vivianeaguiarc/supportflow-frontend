import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `PATCH /tickets/{id}/status`. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.text();

  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
