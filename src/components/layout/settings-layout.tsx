"use client";

import { Gauge, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

interface SettingsNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
}

/** Seções de Configurações (extensível). Cada item é filtrado por permissão. */
const SETTINGS_NAV: SettingsNavItem[] = [
  {
    name: "SLA",
    href: "/settings/sla",
    icon: Gauge,
    permission: "settings:sla:view",
  },
];

/**
 * Layout das páginas de Configurações: variante admin (densidade espaçosa,
 * topbar e cabeçalho diferenciados) + navegação secundária entre seções.
 */
export function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { can } = usePermissions();
  const visibleNav = SETTINGS_NAV.filter((item) => can(item.permission));

  return (
    <AppShell variant="admin">
      <PageContainer density="spacious">
        <PageHeader
          variant="admin"
          title="Configurações"
          description="Administração e parâmetros de negócio do SupportFlow."
        />

        {visibleNav.length > 0 ? (
          <nav className="flex flex-wrap gap-1 border-b border-border">
            {visibleNav.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        ) : null}

        {children}
      </PageContainer>
    </AppShell>
  );
}
