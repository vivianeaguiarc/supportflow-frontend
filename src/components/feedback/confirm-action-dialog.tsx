"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Loader2 } from "lucide-react";
import { type ReactElement, type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";

interface ConfirmActionDialogProps {
  /** Elemento que abre o diálogo (uso não controlado). */
  trigger?: ReactElement;
  /** Estado controlado (opcional). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual do botão de confirmação para ações destrutivas/irreversíveis. */
  tone?: "default" | "destructive";
  /**
   * Ação confirmada. Pode ser assíncrona — o diálogo exibe estado de carregando
   * e só fecha quando a promise resolve.
   */
  onConfirm: () => void | Promise<void>;
}

/**
 * Diálogo de confirmação acessível e reutilizável (Base UI `AlertDialog`) para
 * ações sensíveis: logout, ações em lote, exclusões e operações irreversíveis.
 *
 * Suporta `onConfirm` assíncrono (bloqueia e mostra spinner até concluir) e os
 * modos controlado/não controlado. Foco, `role=alertdialog`, ESC e trap de
 * teclado são gerenciados pelo Base UI.
 */
export function ConfirmActionDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  onConfirm,
}: ConfirmActionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  async function handleConfirm() {
    try {
      setIsPending(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog.Root
      open={actualOpen}
      onOpenChange={(next) => {
        // Evita fechar (ESC/backdrop) enquanto a ação está em andamento.
        if (isPending) return;
        setOpen(next);
      }}
    >
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={tone === "destructive" ? "destructive" : "default"}
              size="sm"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
