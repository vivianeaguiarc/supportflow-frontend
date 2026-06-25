"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";

interface ConfirmDialogProps {
  /** Elemento que abre o diálogo (uso não controlado). */
  trigger?: ReactElement;
  /** Estado controlado (opcional). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual do botão de confirmação. */
  tone?: "default" | "destructive";
  onConfirm?: () => void;
}

/** Diálogo de confirmação acessível (Base UI AlertDialog) para ações sensíveis. */
export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialog.Trigger render={trigger} /> : null}
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 text-card-foreground shadow-lg ring-1 ring-foreground/10 transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <AlertDialog.Title className="font-heading text-base font-semibold">
            {title}
          </AlertDialog.Title>
          {description ? (
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {description}
            </AlertDialog.Description>
          ) : null}
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Close
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {cancelLabel}
            </AlertDialog.Close>
            <AlertDialog.Close
              className={cn(
                buttonVariants({
                  variant: tone === "destructive" ? "destructive" : "default",
                  size: "sm",
                }),
              )}
              onClick={() => onConfirm?.()}
            >
              {confirmLabel}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
