"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { resolveBreadcrumbs } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Trilha de navegação contextual da página atual. */
export function AppBreadcrumb() {
  const pathname = usePathname();
  const crumbs = resolveBreadcrumbs(pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-0.5 hidden min-w-0 sm:block">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? (
                <ChevronRight
                  className="size-3 shrink-0 opacity-50"
                  aria-hidden
                />
              ) : null}
              <li className="flex min-w-0 items-center">
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="truncate rounded-sm transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate",
                      isLast && "font-medium text-foreground",
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
