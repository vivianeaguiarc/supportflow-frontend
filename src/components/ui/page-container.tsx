import type { ReactNode } from "react";

import { PAGE_STACK_CLASSES, type PageDensity } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { PAGE_CONTAINER_SIZES, type PageContainerSize } from "./constants";

interface PageContainerProps {
  children: ReactNode;
  /** Largura máxima do conteúdo. Padrão: `default`. */
  size?: PageContainerSize;
  /** Espaçamento vertical entre blocos filhos. */
  density?: PageDensity;
  className?: string;
}

/**
 * Centraliza e limita a largura do conteúdo de uma página.
 * `density` controla o espaçamento vertical entre seções (compacto na mesa
 * operacional, espaçoso em configurações).
 */
export function PageContainer({
  children,
  size = "default",
  density = "comfortable",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        PAGE_CONTAINER_SIZES[size],
        PAGE_STACK_CLASSES[density],
        className,
      )}
    >
      {children}
    </div>
  );
}
