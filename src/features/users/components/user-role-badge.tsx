import { type Tone } from "@/components/ui/constants";
import { StatusBadge } from "@/components/ui/status-badge";
import type { UserRole } from "@/types/user";

import { USER_ROLE_LABELS } from "../types/user-types";

/** Tom semântico por papel — destaca níveis de acesso sem inventar cores soltas. */
const ROLE_TONE: Record<UserRole, Tone> = {
  ADMIN: "danger",
  SUPERVISOR: "warning",
  AGENT: "info",
  CUSTOMER: "neutral",
  OMBUDSMAN: "muted",
};

/** Badge reutilizável que mapeia `UserRole` para tom + rótulo legível (pt-BR). */
export function UserRoleBadge({ role }: { role: UserRole }) {
  return <StatusBadge tone={ROLE_TONE[role]} label={USER_ROLE_LABELS[role]} />;
}
