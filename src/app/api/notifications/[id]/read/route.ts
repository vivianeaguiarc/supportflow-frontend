import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `PATCH /notifications/{id}/read`. */
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToBackend(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });
}
