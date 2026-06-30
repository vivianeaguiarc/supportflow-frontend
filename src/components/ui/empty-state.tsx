import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Tom da mensagem e do ícone. */
  tone?: "muted" | "primary" | "destructive";
  action?: ReactNode;
  /** Exibe moldura tracejada (recomendado em áreas de conteúdo vazio). */
  framed?: boolean;
  className?: string;
}

const ICON_SHELL: Record<NonNullable<EmptyStateProps["tone"]>, string> = {
  muted: "empty-state-icon-muted",
  primary: "empty-state-icon",
  destructive: "empty-state-icon-destructive",
};

/** Estado vazio reutilizável (ícone + título + descrição + ação). */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  tone = "muted",
  action,
  framed = true,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        framed
          ? "empty-state-shell"
          : "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className,
      )}
    >
      <div className={ICON_SHELL[tone]}>
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
