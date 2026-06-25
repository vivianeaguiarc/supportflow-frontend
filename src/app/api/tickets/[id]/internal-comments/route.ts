import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `GET /tickets/{id}/internal-comments`. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToBackend(`/tickets/${encodeURIComponent(id)}/internal-comments`);
}

/** BFF: `POST /tickets/{id}/internal-comments`. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.text();

  return proxyToBackend(
    `/tickets/${encodeURIComponent(id)}/internal-comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    },
  );
}
