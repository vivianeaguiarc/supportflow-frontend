"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FilterSelectOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  options: FilterSelectOption[];
  /** Opção neutra (valor vazio) exibida no topo e como rótulo padrão. */
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Select de filtro tipado e estilizado, construído sobre o `Select` do Base UI.
 *
 * Diferente do `<select>` nativo, o popup é totalmente estilizável (visual do
 * Design System, animação de abertura/fecho, teclado e acessibilidade). A API
 * pública (`options`, `placeholder`, `value`, `onValueChange`) é a mesma de
 * antes, então todos os filtros/sel*s* do app herdam o novo visual.
 */
export function FilterSelect({
  options,
  placeholder,
  value,
  onValueChange,
  disabled,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: FilterSelectProps) {
  // Quando há placeholder, ele vira um item selecionável de valor "" (limpa o
  // filtro) e também o rótulo padrão exibido no gatilho.
  const items: FilterSelectOption[] =
    placeholder !== undefined
      ? [{ value: "", label: placeholder }, ...options]
      : options;

  return (
    <Select.Root
      items={items}
      value={value ?? ""}
      onValueChange={(next) => onValueChange?.(String(next ?? ""))}
      disabled={disabled}
    >
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(
          "inline-flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent pr-2 pl-2.5 text-sm outline-none transition-colors select-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:border-ring",
          className,
        )}
      >
        <Select.Value
          className="truncate text-left"
          placeholder={placeholder}
        />
        <Select.Icon className="shrink-0 text-muted-foreground transition-transform duration-200 data-[popup-open]:rotate-180">
          <ChevronDown className="size-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          sideOffset={6}
          align="start"
          alignItemWithTrigger={false}
          className="z-50"
        >
          <Select.Popup className="max-h-[min(var(--available-height),20rem)] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-xl bg-card p-1 text-card-foreground shadow-lg ring-1 ring-foreground/10 transition-[transform,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {items.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex cursor-default items-center gap-2 rounded-lg py-1.5 pr-2 pl-2.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <span className="flex w-4 shrink-0 items-center justify-center text-primary">
                  <Select.ItemIndicator>
                    <Check className="size-4" />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText className="truncate">
                  {option.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
