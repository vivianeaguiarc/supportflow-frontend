"use client";

import { SidebarContent } from "./sidebar-content";
import { ThemeToggle } from "./theme-toggle";

/** Sidebar fixa visível em desktop (lg+). */
export function AppSidebar() {
  return (
    <aside className="layout-sidebar">
      <div className="layout-sidebar-inner">
        <SidebarContent />
        <div className="hidden border-t border-sidebar-border p-3 lg:block">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
