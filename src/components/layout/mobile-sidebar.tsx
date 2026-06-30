"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import { useShell } from "./shell-context";
import { SidebarContent } from "./sidebar-content";

/** Drawer lateral da navegação em viewports mobile/tablet. */
export function MobileSidebar() {
  const { mobileNavOpen, closeMobileNav } = useShell();

  return (
    <Sheet
      open={mobileNavOpen}
      onOpenChange={(open) => !open && closeMobileNav()}
    >
      <SheetContent
        side="left"
        hideClose
        aria-label="Menu de navegação"
        className="layout-sidebar-inner w-[var(--layout-sidebar-width)] max-w-[min(85vw,var(--layout-sidebar-width))] gap-0 p-0"
      >
        <SidebarContent
          onNavigate={closeMobileNav}
          showClose
          onClose={closeMobileNav}
          showThemeToggle
        />
      </SheetContent>
    </Sheet>
  );
}
