import { useQuery } from "@tanstack/react-query";

import { slaService } from "../services";
import { slaKeys } from "./sla-keys";

/** Resumo de SLA do tenant (`GET /tickets/sla`). */
export function useSlaSummary() {
  return useQuery({
    queryKey: slaKeys.summary(),
    queryFn: () => slaService.getSummary(),
    staleTime: 30_000,
  });
}
