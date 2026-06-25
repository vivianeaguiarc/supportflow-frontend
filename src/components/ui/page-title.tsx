import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Título principal de uma página (h1) com a tipografia oficial. */
export function PageTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
        className,
      )}
      {...props}
    />
  );
}
