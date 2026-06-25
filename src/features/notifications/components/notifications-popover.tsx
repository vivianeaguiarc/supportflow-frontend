"use client";

import { Popover } from "@base-ui/react/popover";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  RECENT_NOTIFICATIONS_DISPLAY_LIMIT,
  RECENT_NOTIFICATIONS_PARAMS,
  useMarkAllNotificationsAsRead,
  useUnreadNotificationsCount,
} from "../hooks";
import { NotificationList } from "./notification-list";
import { UnreadNotificationsBadge } from "./unread-notifications-badge";

/** Sino de notificações no header: badge de não lidas + painel rápido (popover). */
export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsAsRead();

  const hasUnread = unreadCount > 0;

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
        <UnreadNotificationsBadge
          count={unreadCount}
          className="absolute -top-0.5 -right-0.5"
        />
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
                params={RECENT_NOTIFICATIONS_PARAMS}
                maxItems={RECENT_NOTIFICATIONS_DISPLAY_LIMIT}
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
