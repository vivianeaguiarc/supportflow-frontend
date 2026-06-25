import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TimelineProps {
  children: ReactNode;
  className?: string;
}

/**
 * Timeline genérica (Design System) — lista ordenada com uma linha conectora
 * vertical. Cada item é um `TimelineItem`, que renderiza um marcador (ex.: avatar)
 * e o conteúdo ao lado. Sem acoplamento de domínio.
 */
export function Timeline({ children, className }: TimelineProps) {
  return <ol className={cn("space-y-6", className)}>{children}</ol>;
}

interface TimelineItemProps {
  /** Marcador à esquerda (avatar, ícone). */
  marker: ReactNode;
  /** Oculta a linha conectora (use no último item). */
  isLast?: boolean;
  children: ReactNode;
  className?: string;
}

/** Item da timeline: marcador + conteúdo, com conector entre itens. */
export function TimelineItem({
  marker,
  isLast = false,
  children,
  className,
}: TimelineItemProps) {
  return (
    <li className={cn("relative flex gap-3", className)}>
      <div className="flex flex-col items-center">
        <div className="relative z-10 shrink-0">{marker}</div>
        {isLast ? null : (
          <span aria-hidden className="mt-1 w-px flex-1 bg-border" />
        )}
      </div>
      <div className="flex-1 pb-1">{children}</div>
    </li>
  );
}
