import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";

/**
 * BFF: encaminha a visão geral do dashboard do backend
 * (`GET /analytics/overview`) anexando o access token do cookie HttpOnly.
 */
export async function GET() {
  const response = await backendFetch("/analytics/overview");
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
