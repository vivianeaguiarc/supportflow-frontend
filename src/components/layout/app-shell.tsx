"use client";

import type { ReactNode } from "react";

import { LAYOUT_MAIN_CLASSES, type LayoutVariant } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { ShellProvider } from "./shell-context";

interface AppShellProps {
  children: ReactNode;
  /**
   * Variante de layout:
   * - `standard` — páginas gerais (dashboard, tickets, clientes)
   * - `operational` — mesa de atendimento (densidade compacta)
   * - `admin` — configurações e áreas administrativas
   */
  variant?: LayoutVariant;
}

/** Casca da aplicação: sidebar + header contextual + área de conteúdo. */
export function AppShell({ children, variant = "standard" }: AppShellProps) {
  return (
    <ShellProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader variant={variant} />
          <main
            className={cn(
              "flex-1 overflow-y-auto",
              LAYOUT_MAIN_CLASSES[variant],
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </ShellProvider>
  );
}
