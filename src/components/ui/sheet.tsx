"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

type SheetSide = "right" | "left";

const SIDE_CLASSES: Record<SheetSide, string> = {
  right:
    "inset-y-0 right-0 h-full w-full max-w-md border-l data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
  left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full",
};

interface SheetContentProps extends ComponentProps<
  typeof DialogPrimitive.Popup
> {
  side?: SheetSide;
  /** Oculta o botão de fechar padrão (canto superior direito). */
  hideClose?: boolean;
}

/**
 * Painel lateral (Sheet) com o visual do DS — Portal + Backdrop + Popup
 * deslizante. Construído sobre o `Dialog` do Base UI (mesmo primitivo do
 * `Dialog` modal), trocando o posicionamento central por uma borda da tela e a
 * animação de escala por um *slide* lateral.
 */
function SheetContent({
  className,
  children,
  side = "right",
  hideClose = false,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-card p-6 text-card-foreground shadow-xl ring-1 ring-foreground/10 transition-transform duration-300 ease-out",
          SIDE_CLASSES[side],
          className,
        )}
        {...props}
      >
        {children}
        {hideClose ? null : (
          <DialogPrimitive.Close
            aria-label="Fechar"
            className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-1 pr-8", className)} {...props} />
  );
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-heading text-base font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("-mr-2 flex-1 overflow-y-auto pr-2", className)}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex justify-end gap-2 border-t border-border pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
