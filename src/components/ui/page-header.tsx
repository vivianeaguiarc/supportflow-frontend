import type { ReactNode } from "react";

import {
  PAGE_HEADER_VARIANT_CLASSES,
  type PageHeaderVariant,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

import { PageTitle } from "./page-title";

interface PageHeaderProps {
  /** Título: string (vira `PageTitle`) ou nó customizado. */
  title: ReactNode;
  description?: ReactNode;
  /** Ações alinhadas à direita (ex.: botões). */
  actions?: ReactNode;
  /** Variante visual: operacional (barra teal) ou admin (borda inferior). */
  variant?: PageHeaderVariant;
  className?: string;
}

/** Cabeçalho padrão de página: título + descrição + ações. */
export function PageHeader({
  title,
  description,
  actions,
  variant = "default",
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        PAGE_HEADER_VARIANT_CLASSES[variant],
        className,
      )}
    >
      <div className="space-y-1">
        {typeof title === "string" ? <PageTitle>{title}</PageTitle> : title}
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
