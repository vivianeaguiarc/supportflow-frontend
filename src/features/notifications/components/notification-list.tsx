"use client";

import { Bell } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getErrorMessage } from "@/lib/api-error";

import { useNotifications } from "../hooks";
import type { ListNotificationsParams } from "../types";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  params?: ListNotificationsParams;
  /** Repassado a cada item (ex.: fechar o painel do sino ao navegar). */
  onSelect?: () => void;
  /** Limita quantos itens exibir (recorte client-side, ex.: popover). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Lista de notificações com estados de carregamento/erro/vazio. */
export function NotificationList({
  params,
  onSelect,
  maxItems,
  emptyTitle = "Nenhuma notificação",
  emptyDescription = "Você está em dia. Novas notificações aparecerão aqui.",
}: NotificationListProps) {
  const { data, isLoading, isError, error, refetch } = useNotifications(params);

  if (isLoading) {
    return <LoadingState label="Carregando notificações..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar as notificações"
        description={getErrorMessage(error, "Tente novamente em instantes.")}
        onRetry={() => refetch()}
      />
    );
  }

  const all = data ?? [];
  const notifications = maxItems !== undefined ? all.slice(0, maxItems) : all;

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <ul className="space-y-1">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationItem notification={notification} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
