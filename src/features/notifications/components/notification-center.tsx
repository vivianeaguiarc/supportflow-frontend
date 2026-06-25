"use client";

import { CheckCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";

import {
  useMarkAllNotificationsRead,
  useUnreadNotificationsCount,
} from "../hooks";
import { NotificationList } from "./notification-list";

type Filter = "all" | "unread";

const FILTER_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
];

/** Central de notificações: filtro (todas/não lidas) + ação "marcar todas". */
export function NotificationCenter() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <FilterSelect
          aria-label="Filtrar notificações"
          options={FILTER_OPTIONS}
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
          className="w-40"
        />

        {unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead()}
            disabled={isPending}
          >
            <CheckCheck className="size-4" aria-hidden />
            Marcar todas como lidas
          </Button>
        ) : null}
      </div>

      <NotificationList
        params={filter === "unread" ? { unread: true } : {}}
        emptyTitle={
          filter === "unread"
            ? "Nenhuma notificação não lida"
            : "Nenhuma notificação"
        }
        emptyDescription={
          filter === "unread"
            ? "Você já leu todas as suas notificações."
            : "Novas notificações aparecerão aqui."
        }
      />
    </div>
  );
}
