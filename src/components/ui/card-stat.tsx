import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "./card";

interface CardStatProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Card de métrica/indicador para dashboards (rótulo + valor + ícone opcional). */
export function CardStat({
  label,
  value,
  description,
  icon,
  className,
}: CardStatProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-sm", className)}>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl leading-none font-semibold text-foreground">
            {value}
          </p>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
            {icon}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
