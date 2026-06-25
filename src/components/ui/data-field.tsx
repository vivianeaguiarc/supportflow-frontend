import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DataFieldProps {
  label: string;
  value?: ReactNode;
  /** Texto exibido quando `value` é vazio. Padrão: "—". */
  fallback?: string;
  className?: string;
}

/** Par rótulo/valor para seções de metadados, com fallback para valor vazio. */
export function DataField({
  label,
  value,
  fallback = "—",
  className,
}: DataFieldProps) {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">
        {isEmpty ? (
          <span className="text-muted-foreground">{fallback}</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
