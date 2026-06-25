"use client";

import {
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

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
];

export function AppSidebar() {
  const pathname = usePathname();
  const { can } = usePermissions();
  const visibleNavigation = navigation.filter((item) => can(item.permission));

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LifeBuoy className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">
            SupportFlow
          </p>
          <p className="text-xs text-muted-foreground">Atendimento B2B</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {visibleNavigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/70",
              )}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
