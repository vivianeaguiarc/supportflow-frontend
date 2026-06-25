import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MESSAGES } from "@/lib/notifications";
import {
  createQueryWrapper,
  mockApiError,
  mockNotificationService,
} from "@/test/test-utils";
import type { NotificationWithTicket } from "@/types/notification";

import { notificationsService } from "../services/notifications-service";
import { notificationsKeys } from "./notifications-keys";
import { useMarkAllNotificationsAsRead } from "./use-mark-all-notifications-as-read";
import { useMarkNotificationAsRead } from "./use-mark-notification-as-read";
import { useNotifications } from "./use-notifications";
import { useUnreadNotificationsCount } from "./use-unread-notifications-count";

vi.mock("../services/notifications-service", () => ({
  notificationsService: {
    list: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

function makeNotification(
  overrides: Partial<NotificationWithTicket> = {},
): NotificationWithTicket {
  return {
    id: "ntf-1",
    tenantId: "tenant-1",
    recipientId: "user-1",
    ticketId: "ticket-1",
    type: "TICKET_ASSIGNED",
    title: "Novo chamado atribuído",
    message: "Você foi atribuído ao chamado TK-2026-0001",
    readAt: null,
    createdAt: "2026-01-01T10:00:00.000Z",
    ticket: { id: "ticket-1", protocol: "TK-2026-0001", title: "Reembolso" },
    ...overrides,
  };
}

describe("useNotifications", () => {
  it("lista as notificações repassando os parâmetros", async () => {
    vi.mocked(notificationsService.list).mockResolvedValue([
      makeNotification(),
    ]);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useNotifications({ limit: 10 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(notificationsService.list).toHaveBeenCalledWith({ limit: 10 });
  });
});

describe("useUnreadNotificationsCount", () => {
  it("retorna a contagem de não lidas e consulta com unread: true", async () => {
    vi.mocked(notificationsService.list).mockResolvedValue([
      makeNotification({ id: "a" }),
      makeNotification({ id: "b" }),
    ]);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useUnreadNotificationsCount(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(2);
    expect(notificationsService.list).toHaveBeenCalledWith({ unread: true });
  });
});

describe("useMarkNotificationAsRead", () => {
  it("marca como lida, invalida as listas e não dispara toast de sucesso", async () => {
    vi.mocked(notificationsService.markAsRead).mockResolvedValue(undefined);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMarkNotificationAsRead(), {
      wrapper,
    });

    act(() => result.current.mutate("ntf-1"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(notificationsService.markAsRead).toHaveBeenCalledWith("ntf-1");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationsKeys.all,
    });
    expect(notifications.success).not.toHaveBeenCalled();
  });

  it("notifica erro quando falha", async () => {
    const error = mockApiError(404);
    vi.mocked(notificationsService.markAsRead).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMarkNotificationAsRead(), {
      wrapper,
    });

    act(() => result.current.mutate("ntf-1"));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(notifications.apiError).toHaveBeenCalledWith(error, undefined);
  });
});

describe("useMarkAllNotificationsAsRead", () => {
  it("marca todas, invalida e notifica com a contagem", async () => {
    vi.mocked(notificationsService.markAllAsRead).mockResolvedValue({
      count: 3,
    });
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMarkAllNotificationsAsRead(), {
      wrapper,
    });

    act(() => result.current.mutate());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(notificationsService.markAllAsRead).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationsKeys.all,
    });
    expect(notifications.success).toHaveBeenCalledWith(
      MESSAGES.notification.allRead(3),
    );
  });
});
