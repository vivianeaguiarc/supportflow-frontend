import { AlarmClock, CheckCircle2, Clock, TimerReset } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

import { formatSlaCountdown, getSlaState } from "../lib/desk-sla";

const CHIP_STYLES = {
  breached:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 ring-red-200 dark:ring-red-500/30",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 ring-amber-200 dark:ring-amber-500/30",
  ok: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-500/30",
} as const;

const CHIP_ICON = {
  breached: AlarmClock,
  warning: TimerReset,
  ok: CheckCircle2,
} as const;

interface DeskSlaChipProps {
  ticket: Pick<Ticket, "status" | "slaDueAt">;
  className?: string;
}

/**
 * Chip compacto que destaca a situação de SLA do chamado (atrasado / próximo /
 * no prazo). Para status terminais ou sem prazo, renderiza apenas um indicador
 * neutro. É a peça de "destaque para SLA" da Mesa de Atendimento.
 */
export function DeskSlaChip({ ticket, className }: DeskSlaChipProps) {
  const state = getSlaState(ticket);

  if (state === "none") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border ring-inset",
          className,
        )}
      >
        <Clock className="size-3" aria-hidden />
        Sem SLA ativo
      </span>
    );
  }

  const Icon = CHIP_ICON[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        CHIP_STYLES[state],
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {formatSlaCountdown(ticket.slaDueAt)}
    </span>
  );
}
