import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `PATCH /tickets/bulk/assign` (atribuição de responsável em lote, atômica). */
export async function PATCH(request: Request) {
  const body = await request.text();

  return proxyToBackend("/tickets/bulk/assign", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
