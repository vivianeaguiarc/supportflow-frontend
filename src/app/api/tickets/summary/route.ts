import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/summary`. */
export async function GET() {
  return proxyToBackend("/tickets/summary");
}
