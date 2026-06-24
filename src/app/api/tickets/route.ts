import type { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets` (lista paginada com filtros). */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyToBackend(`/tickets${search}`);
}

/** BFF: `POST /tickets` (cria chamado). */
export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend("/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
