import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { commentsKeys } from "@/features/comments/hooks";
import { ticketsKeys } from "@/features/tickets/hooks";
import { createQueryWrapper, mockNotificationService } from "@/test/test-utils";
import type { NotificationWithTicket } from "@/types/notification";

import { notificationsService } from "../services/notifications-service";
import { notificationsKeys } from "./notifications-keys";
import { RECENT_NOTIFICATIONS_PARAMS } from "./use-notifications";
import { useNotificationsSync } from "./use-notifications-sync";

vi.mock("../services/notifications-service", () => ({
  notificationsService: {
    list: vi.fn(),
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
    type: "TICKET_COMMENT_ADDED",
    title: "Novo comentário no chamado",
    message: "Comentário interno adicionado ao TK-1",
    readAt: null,
    createdAt: "2026-01-01T10:00:00.000Z",
    ticket: { id: "ticket-1", protocol: "TK-1", title: "Reembolso" },
    ...overrides,
  };
}

describe("useNotificationsSync", () => {
  it("não invalida nem notifica na primeira carga (apenas semeia baseline)", async () => {
    vi.mocked(notificationsService.list).mockResolvedValue([
      makeNotification(),
    ]);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useNotificationsSync(), { wrapper });

    await waitFor(() =>
      expect(notificationsService.list).toHaveBeenCalledWith(
        RECENT_NOTIFICATIONS_PARAMS,
      ),
    );

    expect(notifications.info).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalledWith({
      queryKey: commentsKeys.list("ticket-1"),
    });
  });

  it("ao chegar TICKET_COMMENT_ADDED novo, invalida comentários + histórico e notifica", async () => {
    vi.mocked(notificationsService.list).mockResolvedValue([]);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const key = notificationsKeys.list(RECENT_NOTIFICATIONS_PARAMS);

    renderHook(() => useNotificationsSync(), { wrapper });

    // Baseline (lista vazia) semeado de forma determinística.
    await waitFor(() => expect(queryClient.getQueryData(key)).toEqual([]));

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    // Simula a chegada de um novo evento no próximo "poll".
    act(() => {
      queryClient.setQueryData(key, [makeNotification()]);
    });

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: commentsKeys.list("ticket-1"),
      }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.history("ticket-1"),
    });
    expect(notifications.info).toHaveBeenCalledTimes(1);
  });

  it("evento de status alterado invalida detalhe + listas do ticket", async () => {
    vi.mocked(notificationsService.list).mockResolvedValue([]);
    mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const key = notificationsKeys.list(RECENT_NOTIFICATIONS_PARAMS);

    renderHook(() => useNotificationsSync(), { wrapper });
    await waitFor(() => expect(queryClient.getQueryData(key)).toEqual([]));

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    act(() => {
      queryClient.setQueryData(key, [
        makeNotification({
          id: "ntf-2",
          type: "TICKET_STATUS_CHANGED",
          title: "Status alterado",
        }),
      ]);
    });

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ticketsKeys.detail("ticket-1"),
      }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.lists(),
    });
  });
});
