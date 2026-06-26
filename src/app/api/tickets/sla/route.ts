import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/sla` (resumo de SLA por status: no prazo/alerta/violado). */
export async function GET() {
  return proxyToBackend("/tickets/sla");
}
