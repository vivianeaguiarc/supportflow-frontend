import { cn } from "@/lib/utils";

import { Badge } from "./badge";
import { type Tone, TONE_BADGE_CLASSES } from "./constants";

interface StatusBadgeProps {
  /** Texto exibido no badge. */
  label: string;
  /** Tom semântico (cor). Padrão: `neutral`. */
  tone?: Tone;
  className?: string;
}

/**
 * Badge de status genérico, dirigido por tom semântico. Componentes de domínio
 * (ex.: tickets) mapeiam seus enums para `tone` + `label` e reutilizam este
 * componente, evitando duplicar estilos.
 */
export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(TONE_BADGE_CLASSES[tone], className)}
    >
      {label}
    </Badge>
  );
}
