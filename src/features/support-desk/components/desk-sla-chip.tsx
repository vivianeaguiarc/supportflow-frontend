import { AlarmClock, CheckCircle2, Clock, TimerReset } from "lucide-react";

import { SLA_CHIP_CLASSES, type SlaChipState } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

import { formatSlaCountdown, getSlaState } from "../lib/desk-sla";

const CHIP_ICON = {
  breached: AlarmClock,
  warning: TimerReset,
  ok: CheckCircle2,
} as const;

interface DeskSlaChipProps {
  ticket: Pick<Ticket, "status" | "slaDueAt">;
  className?: string;
}

/** Chip compacto de situação de SLA — cores via tokens semânticos. */
export function DeskSlaChip({ ticket, className }: DeskSlaChipProps) {
  const state = getSlaState(ticket);

  if (state === "none") {
    return (
      <span className={cn(SLA_CHIP_CLASSES.none, className)}>
        <Clock className="size-3" aria-hidden />
        Sem SLA ativo
      </span>
    );
  }

  const Icon = CHIP_ICON[state];

  return (
    <span className={cn(SLA_CHIP_CLASSES[state as SlaChipState], className)}>
      <Icon className="size-3" aria-hidden />
      {formatSlaCountdown(ticket.slaDueAt)}
    </span>
  );
}
