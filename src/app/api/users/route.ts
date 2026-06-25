import type { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /users` (lista paginada de usuários; RBAC `USERS_MANAGE` no backend). */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyToBackend(`/users${search}`);
}
