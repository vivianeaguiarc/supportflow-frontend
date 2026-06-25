import type { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /ticket-categories` (lista paginada de categorias). */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyToBackend(`/ticket-categories${search}`);
}
