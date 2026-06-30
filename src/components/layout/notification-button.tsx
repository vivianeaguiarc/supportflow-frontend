"use client";

import {
  NotificationsPopover,
  NotificationsSync,
} from "@/features/notifications";

/** Agrupa sincronização e popover de notificações no header. */
export function NotificationButton() {
  return (
    <div className="flex items-center">
      <NotificationsSync />
      <NotificationsPopover />
    </div>
  );
}
