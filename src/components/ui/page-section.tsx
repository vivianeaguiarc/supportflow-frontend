import type { ReactNode } from "react";

import { SECTION_STACK_CLASSES } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** Densidade interna da seção (compacta na mesa operacional). */
  density?: "compact" | "comfortable";
  className?: string;
}

/** Bloco de conteúdo dentro de uma página, com cabeçalho opcional. */
export function PageSection({
  title,
  description,
  actions,
  children,
  density = "comfortable",
  className,
}: PageSectionProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <section className={cn(SECTION_STACK_CLASSES[density], className)}>
      {hasHeader ? (
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            {title ? (
              <h2 className="font-heading text-base font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
