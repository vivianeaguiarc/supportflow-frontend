import type { ReactNode } from "react";

import { STAT_ACCENT_CLASSES, type StatAccent } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "./card";

export type { StatAccent };

interface CardStatProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  accent?: StatAccent;
  /** Percentual 0–100 para exibir uma barra de progresso (ex.: SLA). */
  progress?: number;
  className?: string;
}

/** Card de métrica/indicador para dashboards (rótulo + valor + ícone opcional). */
export function CardStat({
  label,
  value,
  description,
  icon,
  accent = "neutral",
  progress,
  className,
}: CardStatProps) {
  const clampedProgress =
    progress === undefined ? undefined : Math.max(0, Math.min(100, progress));

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          {icon ? (
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg [&_svg]:size-4.5",
                STAT_ACCENT_CLASSES[accent],
              )}
            >
              {icon}
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>

        <p className="font-heading text-2xl leading-none font-semibold text-foreground">
          {value}
        </p>

        {clampedProgress !== undefined ? (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        ) : null}

        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
