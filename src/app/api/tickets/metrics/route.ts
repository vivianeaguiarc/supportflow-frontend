import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/metrics`. */
export async function GET() {
  return proxyToBackend("/tickets/metrics");
}
