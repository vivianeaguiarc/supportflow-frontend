"use client";

import { LifeBuoy, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { NAV_GROUPS } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

interface SidebarContentProps {
  /** Fecha drawer mobile após navegação. */
  onNavigate?: () => void;
  /** Exibe botão de fechar (drawer mobile). */
  showClose?: boolean;
  onClose?: () => void;
  /** Rodapé com alternador de tema. */
  showThemeToggle?: boolean;
}

/** Conteúdo reutilizável da sidebar (desktop fixa + drawer mobile). */
export function SidebarContent({
  onNavigate,
  showClose = false,
  onClose,
  showThemeToggle = false,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { can } = usePermissions();

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => can(item.permission)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <div className="layout-sidebar-brand">
        <div className="layout-sidebar-brand-mark">
          <LifeBuoy className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-heading text-sm font-semibold text-sidebar-foreground">
            SupportFlow
          </p>
          <p className="text-xs text-muted-foreground">Atendimento B2B</p>
        </div>
        {showClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fechar menu de navegação"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex flex-1 flex-col overflow-y-auto p-3"
      >
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="nav-group-label">{group.label}</p>
            <div
              className="flex flex-col"
              style={{ gap: "var(--layout-nav-group-gap)" }}
            >
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "group nav-item",
                      isActive ? "nav-item-active" : "nav-item-inactive",
                    )}
                  >
                    <span
                      className={cn(
                        "nav-item-icon-wrap",
                        isActive
                          ? "nav-item-icon-wrap-active"
                          : "nav-item-icon-wrap-inactive",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {showThemeToggle ? (
        <div className="border-t border-sidebar-border p-3">
          <ThemeToggle />
        </div>
      ) : null}
    </>
  );
}
