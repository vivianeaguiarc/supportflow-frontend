import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

interface AppShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title={title} description={description} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
