"use client";

import {
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  type LucideIcon,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/features/auth/hooks";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
  },
  {
    name: "Chamados",
    href: "/tickets",
    icon: Ticket,
    permission: "tickets:view",
  },
  {
    name: "Clientes",
    href: "/customers",
    icon: Users,
    permission: "directory:view",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { can } = usePermissions();
  const { user, logout } = useAuth();
  const visibleNavigation = navigation.filter((item) => can(item.permission));

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <LifeBuoy className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">
            SupportFlow
          </p>
          <p className="text-xs text-muted-foreground">Atendimento B2B</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {visibleNavigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-muted-foreground",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-sidebar-border p-2">
            <UserAvatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Sair"
              title="Sair"
              onClick={logout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
