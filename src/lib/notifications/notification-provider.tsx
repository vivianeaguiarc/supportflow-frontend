"use client";

import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface NotificationProviderProps {
  children?: ReactNode;
}

/**
 * Provider global de notificações: monta o `Toaster` do Sonner uma única vez,
 * sincronizado com o tema (claro/escuro) e com padrões de acessibilidade.
 *
 * Acessibilidade:
 * - O Sonner usa uma região `aria-live` para anunciar os toasts a leitores de
 *   tela e gerencia o foco/atalho de teclado para navegar entre eles.
 * - `closeButton` garante fechamento acessível por mouse e teclado.
 * - `duration` de 5s dá tempo de leitura sem prender a atenção do usuário.
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={(resolvedTheme as "light" | "dark") ?? "system"}
        position="top-right"
        richColors
        closeButton
        duration={5000}
        gap={8}
        toastOptions={{
          classNames: {
            toast: "font-sans",
          },
        }}
      />
    </>
  );
}
