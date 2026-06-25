"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { useMarkNotificationRead } from "../hooks";
import type { NotificationWithTicket } from "../types";
import { formatRelativeTime, NOTIFICATION_TYPE_META } from "../types";

interface NotificationItemProps {
  notification: NotificationWithTicket;
  /** Chamado após tratar o clique (ex.: fechar o painel do sino). */
  onSelect?: () => void;
}

/**
 * Linha de uma notificação. Clicar marca como lida (se não lida) e navega para
 * o chamado relacionado, quando houver.
 */
export function NotificationItem({
  notification,
  onSelect,
}: NotificationItemProps) {
  const router = useRouter();
  const { mutate: markRead } = useMarkNotificationRead();

  const meta = NOTIFICATION_TYPE_META[notification.type];
  const Icon = meta.icon;
  const isUnread = notification.readAt === null;

  function handleClick() {
    if (isUnread) {
      markRead(notification.id);
    }
    if (notification.ticketId) {
      router.push(`/tickets/${notification.ticketId}`);
    }
    onSelect?.();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isUnread && "bg-muted/40",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUnread
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {notification.title}
          </p>
          {isUnread ? (
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              aria-label="Não lida"
            />
          ) : null}
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>

        <p className="text-xs text-muted-foreground/80">
          {notification.ticket ? (
            <span className="font-medium text-muted-foreground">
              {notification.ticket.protocol}
            </span>
          ) : (
            <span>{meta.label}</span>
          )}
          {" · "}
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
