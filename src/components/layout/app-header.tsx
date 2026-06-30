"use client";

import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  LAYOUT_HEADER_CLASSES,
  type LayoutVariant,
  resolveRouteContext,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

import { AppBreadcrumb } from "./app-breadcrumb";
import { GlobalSearch } from "./global-search";
import { NotificationButton } from "./notification-button";
import { useShell } from "./shell-context";
import { UserMenu } from "./user-menu";

interface AppHeaderProps {
  variant?: LayoutVariant;
}

/**
 * Cabeçalho da aplicação: breadcrumb, título, busca global (visual),
 * notificações e menu do usuário.
 */
export function AppHeader({ variant = "standard" }: AppHeaderProps) {
  const pathname = usePathname();
  const context = resolveRouteContext(pathname);
  const { mobileNavOpen, openMobileNav } = useShell();

  return (
    <header className={cn(LAYOUT_HEADER_CLASSES[variant])}>
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Abrir menu de navegação"
          aria-expanded={mobileNavOpen}
          onClick={openMobileNav}
        >
          <Menu className="size-5" aria-hidden />
        </Button>

        <div className="min-w-0 flex-1">
          <AppBreadcrumb />
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
              {context.label}
            </h1>
            <span className="hidden shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-primary uppercase xl:inline">
              {context.area}
            </span>
          </div>
        </div>
      </div>

      <GlobalSearch />

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled
          aria-label="Busca global (em breve)"
          className="md:hidden"
        >
          <Search className="size-5" aria-hidden />
        </Button>
        <NotificationButton />
        <UserMenu />
      </div>
    </header>
  );
}
