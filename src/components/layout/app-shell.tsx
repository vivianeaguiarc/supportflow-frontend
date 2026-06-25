import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";

interface AppShellProps {
  children: ReactNode;
}

/** Casca da aplicação: sidebar fixa + área de conteúdo rolável. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
