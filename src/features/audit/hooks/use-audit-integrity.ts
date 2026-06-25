import { useQuery } from "@tanstack/react-query";

import { auditService } from "../services";
import { auditKeys } from "./audit-keys";

/**
 * Verificação da integridade da cadeia imutável (`GET /admin/audit-logs/verify`).
 *
 * Sob demanda (`enabled: false`): a verificação percorre toda a cadeia, então
 * só é executada quando o usuário aciona (via `refetch`), evitando custo a cada
 * abertura da página.
 */
export function useAuditIntegrity() {
  return useQuery({
    queryKey: auditKeys.verify(),
    queryFn: () => auditService.verifyChain(),
    enabled: false,
    gcTime: 0,
  });
}
