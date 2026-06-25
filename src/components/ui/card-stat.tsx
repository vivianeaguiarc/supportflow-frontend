import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "./card";

export type StatAccent =
  | "violet"
  | "emerald"
  | "amber"
  | "blue"
  | "red"
  | "neutral";

const ACCENT_CHIP: Record<StatAccent, string> = {
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  red: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
  neutral: "bg-muted text-muted-foreground",
};

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
        "transition-shadow hover:shadow-md hover:shadow-foreground/5",
        className,
      )}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          {icon ? (
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg [&_svg]:size-4.5",
                ACCENT_CHIP[accent],
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
