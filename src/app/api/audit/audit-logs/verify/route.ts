import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /admin/audit-logs/verify` (integridade da cadeia imutável). */
export async function GET() {
  return proxyToBackend("/admin/audit-logs/verify");
}
