"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export interface FilterSelectOption {
  label: string;
  value: string;
}

interface FilterSelectProps extends Omit<
  ComponentProps<"select">,
  "onChange" | "children"
> {
  options: FilterSelectOption[];
  /** Opção neutra (valor vazio) exibida no topo. */
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

/** Select de filtro tipado e estilizado (controle nativo acessível). */
export function FilterSelect({
  options,
  placeholder,
  value,
  onValueChange,
  className,
  ...props
}: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        className={cn(
          "h-8 w-full appearance-none rounded-lg border border-input bg-transparent pr-8 pl-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
