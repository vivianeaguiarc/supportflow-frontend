"use client";

import { Search, X } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

interface SearchInputProps extends ComponentProps<"input"> {
  containerClassName?: string;
  /** Quando fornecido e houver valor, exibe botão de limpar. */
  onClear?: () => void;
}

/** Input de busca com ícone e botão opcional de limpar. */
export function SearchInput({
  className,
  containerClassName,
  onClear,
  value,
  ...props
}: SearchInputProps) {
  const showClear =
    Boolean(onClear) && typeof value === "string" && value.length > 0;

  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        className={cn("pl-8", showClear && "pr-8", className)}
        {...props}
      />
      {showClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar busca"
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
