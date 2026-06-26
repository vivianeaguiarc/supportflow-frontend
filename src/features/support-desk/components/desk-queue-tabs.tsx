"use client";

import { cn } from "@/lib/utils";

import { DESK_QUEUES, type DeskQueueId } from "../lib/desk-queues";

interface DeskQueueTabsProps {
  active: DeskQueueId;
  onChange: (queue: DeskQueueId) => void;
  /** Contagens conhecidas via `GET /tickets/summary` (open/unassigned/overdue). */
  counts?: Partial<Record<DeskQueueId, number>>;
}

/**
 * Seletor segmentado das filas operacionais. Visual mais "denso" que abas de
 * navegação para reforçar o caráter de mesa de trabalho.
 */
export function DeskQueueTabs({
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
      {DESK_QUEUES.map((queue) => {
        const isActive = queue.id === active;
        const count = counts?.[queue.id];
        const Icon = queue.icon;

        return (
          <button
            key={queue.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(queue.id)}
            title={queue.description}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {queue.label}
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
