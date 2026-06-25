import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

/** Estado de carregamento reutilizável (spinner + rótulo). */
export function LoadingState({
  label = "Carregando...",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-sm text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}
