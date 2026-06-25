import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `PATCH /tickets/bulk/status` (alteração de status em lote, atômica). */
export async function PATCH(request: Request) {
  const body = await request.text();

  return proxyToBackend("/tickets/bulk/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
