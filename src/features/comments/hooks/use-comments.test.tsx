import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { commentsService } from "@/features/comments/services/comments-service";
import { ticketsKeys } from "@/features/tickets/hooks";
import { MESSAGES } from "@/lib/notifications";
import {
  createQueryWrapper,
  mockApiError,
  mockNotificationService,
} from "@/test/test-utils";
import type { TicketCommentWithAuthor } from "@/types/comment";

import { commentsKeys } from "./comments-keys";
import { useCreateComment } from "./use-create-comment";
import { useTicketComments } from "./use-ticket-comments";

vi.mock("@/features/comments/services/comments-service", () => ({
  commentsService: {
    list: vi.fn(),
    create: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

function makeComment(
  overrides: Partial<TicketCommentWithAuthor> = {},
): TicketCommentWithAuthor {
  return {
    id: "comment-1",
    ticketId: "ticket-1",
    tenantId: "tenant-1",
    authorId: "user-1",
    content: "Contato realizado com o cliente.",
    visibility: "INTERNAL",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
    author: { id: "user-1", name: "Maria", email: "maria@x.com" },
    ...overrides,
  };
}

describe("useTicketComments", () => {
  it("lista os comentários do ticket", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([makeComment()]);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTicketComments("ticket-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(commentsService.list).toHaveBeenCalledWith("ticket-1");
  });

  it("não busca quando o ticketId é vazio", () => {
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTicketComments(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(commentsService.list).not.toHaveBeenCalled();
  });
});

describe("useCreateComment", () => {
  it("cria, invalida comentários + histórico e notifica sucesso", async () => {
    vi.mocked(commentsService.create).mockResolvedValue(makeComment());
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateComment("ticket-1"), {
      wrapper,
    });
    act(() => result.current.mutate({ content: "Novo comentário" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(commentsService.create).toHaveBeenCalledWith("ticket-1", {
      content: "Novo comentário",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: commentsKeys.list("ticket-1"),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.history("ticket-1"),
    });
    expect(notifications.success).toHaveBeenCalledWith(MESSAGES.comment.added);
  });

  it("notifica erro quando a criação falha", async () => {
    const error = mockApiError(403);
    vi.mocked(commentsService.create).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCreateComment("ticket-1"), {
      wrapper,
    });
    act(() => result.current.mutate({ content: "x" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(notifications.apiError).toHaveBeenCalledWith(error, undefined);
  });
});
