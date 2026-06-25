import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Tom da mensagem: `muted` (padrão) ou `destructive` (erros). */
  tone?: "muted" | "destructive";
  action?: ReactNode;
  className?: string;
}

/** Estado vazio/erro reutilizável (ícone + título + descrição + ação). */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  tone = "muted",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-12 text-center",
        className,
      )}
    >
      <Icon
        className={cn(
          "size-6",
          tone === "destructive" ? "text-destructive" : "text-muted-foreground",
        )}
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
