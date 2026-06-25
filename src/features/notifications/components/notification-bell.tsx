"use client";

import { Popover } from "@base-ui/react/popover";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  useMarkAllNotificationsRead,
  useUnreadNotificationsCount,
} from "../hooks";
import { NotificationList } from "./notification-list";

/** Limite de itens exibidos no painel do sino (lista completa em /notifications). */
const PANEL_LIMIT = 10;

/** Sino de notificações com badge de não lidas e painel rápido. */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead();

  const hasUnread = unreadCount > 0;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={
          hasUnread ? `Notificações (${unreadCount} não lidas)` : "Notificações"
        }
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <Bell className="size-5" aria-hidden />
        {hasUnread ? (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-4 text-primary-foreground">
            {badgeLabel}
          </span>
        ) : null}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end" className="z-50">
          <Popover.Popup className="w-[22rem] max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] rounded-xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10 transition-[transform,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
              <Popover.Title className="font-heading text-sm font-semibold">
                Notificações
              </Popover.Title>
              {hasUnread ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => markAllRead()}
                  disabled={isPending}
                >
                  <CheckCheck className="size-3.5" aria-hidden />
                  Marcar todas
                </Button>
              ) : null}
            </div>

            <div className="max-h-[24rem] overflow-y-auto p-2">
              <NotificationList
                params={{ limit: PANEL_LIMIT }}
                onSelect={() => setOpen(false)}
              />
            </div>

            <div className="border-t border-border p-2">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full",
                )}
              >
                Ver todas as notificações
              </Link>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
