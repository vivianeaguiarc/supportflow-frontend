import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Headset,
  LayoutDashboard,
  ScrollText,
  Settings,
  Ticket,
  UserCog,
  Users,
} from "lucide-react";

import type { Permission } from "@/lib/permissions";

/** Variante de layout da casca da aplicação. */
export type LayoutVariant = "standard" | "operational" | "admin";

export const LAYOUT_MAIN_CLASSES: Record<LayoutVariant, string> = {
  standard: "layout-main-standard",
  operational: "layout-main-operational",
  admin: "layout-main-admin",
};

export const LAYOUT_HEADER_CLASSES: Record<LayoutVariant, string> = {
  standard: "layout-header",
  operational: "layout-header layout-header-operational",
  admin: "layout-header layout-header-admin",
};

/** @deprecated Use LAYOUT_HEADER_CLASSES */
export const LAYOUT_TOPBAR_CLASSES = LAYOUT_HEADER_CLASSES;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Monta trilha de navegação a partir da rota atual. */
export function resolveBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: "Início", href: "/dashboard" }];

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        crumbs.push({ label: group.label });
        crumbs.push({ label: item.name, href: item.href });

        if (pathname !== item.href) {
          const suffix = pathname.slice(item.href.length + 1);
          if (suffix === "new") crumbs.push({ label: "Novo" });
          else if (suffix) crumbs.push({ label: "Detalhe" });
        }
        return crumbs;
      }
    }
  }

  if (pathname.startsWith("/settings")) {
    crumbs.push({ label: "Administração" });
    crumbs.push({ label: "Configurações", href: "/settings/sla" });
    if (pathname.includes("/sla")) crumbs.push({ label: "SLA" });
    return crumbs;
  }

  const context = resolveRouteContext(pathname);
  crumbs.push({ label: context.label });
  return crumbs;
}

/** Densidade vertical de páginas e seções. */
export type PageDensity = "compact" | "comfortable" | "spacious";

export const PAGE_STACK_CLASSES: Record<PageDensity, string> = {
  compact: "page-stack-compact",
  comfortable: "page-stack-comfortable",
  spacious: "page-stack-spacious",
};

export const SECTION_STACK_CLASSES: Record<"compact" | "comfortable", string> =
  {
    compact: "section-stack-compact",
    comfortable: "section-stack-comfortable",
  };

/** Variante visual do cabeçalho de página. */
export type PageHeaderVariant = "default" | "operational" | "admin";

export const PAGE_HEADER_VARIANT_CLASSES: Record<PageHeaderVariant, string> = {
  default: "",
  operational: "page-header-operational",
  admin: "page-header-admin",
};

export interface NavItemDef {
  name: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
}

export interface NavGroupDef {
  label: string;
  items: NavItemDef[];
}

/**
 * Navegação principal agrupada por contexto de uso:
 * - Operação: trabalho diário do atendente
 * - Administração: gestão, auditoria e configuração
 */
export const NAV_GROUPS: NavGroupDef[] = [
  {
    label: "Operação",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard:view",
      },
      {
        name: "Mesa de Atendimento",
        href: "/support-desk",
        icon: Headset,
        permission: "support-desk:access",
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
      {
        name: "Notificações",
        href: "/notifications",
        icon: Bell,
        permission: "notifications:view",
      },
    ],
  },
  {
    label: "Administração",
    items: [
      {
        name: "Equipe",
        href: "/users",
        icon: UserCog,
        permission: "users:list",
      },
      {
        name: "Auditoria",
        href: "/audit",
        icon: ScrollText,
        permission: "audit:view",
      },
      {
        name: "Configurações",
        href: "/settings/sla",
        icon: Settings,
        permission: "settings:sla:view",
      },
    ],
  },
];

/** Rótulo de contexto exibido na topbar conforme a rota. */
export const ROUTE_CONTEXT: Record<string, { label: string; area: string }> = {
  "/dashboard": { label: "Dashboard", area: "Operação" },
  "/support-desk": { label: "Mesa de Atendimento", area: "Operação" },
  "/tickets": { label: "Chamados", area: "Operação" },
  "/customers": { label: "Clientes", area: "Operação" },
  "/notifications": { label: "Notificações", area: "Operação" },
  "/users": { label: "Equipe", area: "Administração" },
  "/audit": { label: "Auditoria", area: "Administração" },
  "/settings": { label: "Configurações", area: "Administração" },
};

/** Resolve contexto da rota atual para a topbar. */
export function resolveRouteContext(pathname: string): {
  label: string;
  area: string;
} {
  const entries = Object.entries(ROUTE_CONTEXT).sort(
    ([a], [b]) => b.length - a.length,
  );

  for (const [prefix, context] of entries) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return context;
    }
  }

  return { label: "SupportFlow", area: "Operação" };
}
