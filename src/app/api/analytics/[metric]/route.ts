import { NextResponse } from "next/server";

import { proxyToBackend } from "@/lib/api/backend";

/**
 * BFF de analytics. Mapeia slugs permitidos para os paths reais do backend
 * (`supportflow-backend/.../analytics.routes.ts`) e injeta o Bearer do cookie
 * HttpOnly. Allowlist evita proxy arbitrário.
 */
const METRIC_PATHS: Record<string, string> = {
  overview: "/analytics/overview",
  "tickets-by-status": "/analytics/tickets-by-status",
  "tickets-by-priority": "/analytics/tickets-by-priority",
  sla: "/analytics/sla",
  "agents-performance": "/analytics/agents-performance",
  csat: "/analytics/csat",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ metric: string }> },
) {
  const { metric } = await params;
  const backendPath = METRIC_PATHS[metric];

  if (!backendPath) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESOURCE_NOT_FOUND",
          message: "Métrica de analytics desconhecida.",
          details: [],
        },
      },
      { status: 404 },
    );
  }

  return proxyToBackend(backendPath);
}
