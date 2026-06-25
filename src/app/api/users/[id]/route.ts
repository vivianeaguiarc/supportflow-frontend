import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /users/{id}` (RBAC `USERS_MANAGE` no backend → ADMIN). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToBackend(`/users/${encodeURIComponent(id)}`);
}
