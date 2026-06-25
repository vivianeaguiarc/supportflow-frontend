import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { PAGE_CONTAINER_SIZES, type PageContainerSize } from "./constants";

interface PageContainerProps {
  children: ReactNode;
  /** Largura máxima do conteúdo. Padrão: `default`. */
  size?: PageContainerSize;
  className?: string;
}

/** Centraliza e limita a largura do conteúdo de uma página, com padding responsivo. */
export function PageContainer({
  children,
  size = "default",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        PAGE_CONTAINER_SIZES[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
