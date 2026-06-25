import type { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /customers` (lista paginada de clientes; RBAC no backend). */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyToBackend(`/customers${search}`);
}
