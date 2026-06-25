import type { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/summary` (aceita filtros como `customerId`). */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyToBackend(`/tickets/summary${search}`);
}
