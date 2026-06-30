"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DeskTabDef {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface DeskQueueTabsProps {
  /** Abas a exibir (filas operacionais + abas especiais, ex.: "SLA violado"). */
  tabs: readonly DeskTabDef[];
  active: string;
  onChange: (id: string) => void;
  /** Contagens conhecidas (ex.: via `GET /tickets/summary`). */
  counts?: Record<string, number | undefined>;
}

/**
 * Seletor segmentado das abas operacionais. Visual mais "denso" que abas de
 * navegação para reforçar o caráter de mesa de trabalho.
 */
export function DeskQueueTabs({
  tabs,
  active,
  onChange,
  counts,
}: DeskQueueTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filas de atendimento"
      className="flex flex-wrap gap-1.5"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const count = counts?.[tab.id];
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            title={tab.description}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {tab.label}
            {typeof count === "number" ? (
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
