import { PRIORITY_LABEL, PRIORITY_TONE, type PriorityLevel } from "./constants";
import { StatusBadge } from "./status-badge";

interface PriorityBadgeProps {
  /** Nível de prioridade genérico. */
  level: PriorityLevel;
  /** Rótulo opcional (sobrepõe o padrão pt-BR). */
  label?: string;
  className?: string;
}

/** Badge de prioridade — composição sobre `StatusBadge` + tokens de prioridade. */
export function PriorityBadge({ level, label, className }: PriorityBadgeProps) {
  return (
    <StatusBadge
      tone={PRIORITY_TONE[level]}
      label={label ?? PRIORITY_LABEL[level]}
      className={className}
    />
  );
}
