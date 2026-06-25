import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { NotificationBell } from "@/features/notifications";

interface AppShellProps {
  children: ReactNode;
}

/** Casca da aplicação: sidebar fixa + topbar + área de conteúdo rolável. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-end gap-1 border-b border-border px-6">
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
