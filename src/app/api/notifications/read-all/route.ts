import { proxyToBackend } from "@/lib/api/backend";

/** BFF: `PATCH /notifications/read-all`. */
export async function PATCH() {
  return proxyToBackend("/notifications/read-all", { method: "PATCH" });
}
