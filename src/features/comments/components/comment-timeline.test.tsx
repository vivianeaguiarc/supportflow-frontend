import { afterEach, describe, expect, it, vi } from "vitest";

import { Can } from "@/components/auth";
import { commentsService } from "@/features/comments/services/comments-service";
import {
  makeUser,
  mockNotificationService,
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/test/test-utils";
import type { TicketCommentWithAuthor } from "@/types/comment";

import { CommentTimeline } from "./comment-timeline";

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
    author: { id: "user-1", name: "Maria Santos", email: "maria@x.com" },
    ...overrides,
  };
}

describe("CommentTimeline", () => {
  it("renderiza o empty state quando não há comentários", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([]);

    renderWithProviders(<CommentTimeline ticketId="ticket-1" />, {
      user: makeUser("AGENT"),
    });

    expect(
      await screen.findByText("Nenhum comentário ainda"),
    ).toBeInTheDocument();
  });

  it("renderiza os comentários com autor e badge de visibilidade", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([makeComment()]);

    renderWithProviders(<CommentTimeline ticketId="ticket-1" />, {
      user: makeUser("AGENT"),
    });

    expect(
      await screen.findByText("Contato realizado com o cliente."),
    ).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("Interno")).toBeInTheDocument();
  });

  it("não renderiza a seção para quem não tem tickets:view-internal-comments", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([makeComment()]);

    renderWithProviders(
      <Can perform="tickets:view-internal-comments">
        <CommentTimeline ticketId="ticket-1" />
      </Can>,
      { user: makeUser("CUSTOMER") },
    );

    // A seção é gateada no nível da página: o CUSTOMER não a vê e a query nem
    // chega a ser disparada.
    expect(
      screen.queryByText("Nenhum comentário ainda"),
    ).not.toBeInTheDocument();
    expect(commentsService.list).not.toHaveBeenCalled();
  });

  it("oculta o formulário para quem não tem tickets:comment", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([]);

    renderWithProviders(<CommentTimeline ticketId="ticket-1" />, {
      user: makeUser("CUSTOMER"),
    });

    await screen.findByText("Nenhum comentário ainda");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("exibe o formulário para staff (AGENT)", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([]);

    renderWithProviders(<CommentTimeline ticketId="ticket-1" />, {
      user: makeUser("AGENT"),
    });

    await screen.findByText("Nenhum comentário ainda");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("chama a mutation ao enviar um comentário válido", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([]);
    vi.mocked(commentsService.create).mockResolvedValue(makeComment());
    mockNotificationService();
    const user = userEvent.setup();

    renderWithProviders(<CommentTimeline ticketId="ticket-1" />, {
      user: makeUser("AGENT"),
    });

    await screen.findByText("Nenhum comentário ainda");
    await user.type(screen.getByRole("textbox"), "Novo comentário interno");
    await user.click(screen.getByRole("button", { name: /comentar/i }));

    await waitFor(() =>
      expect(commentsService.create).toHaveBeenCalledWith("ticket-1", {
        content: "Novo comentário interno",
      }),
    );
  });

  it("exibe erro inline quando a API falha", async () => {
    vi.mocked(commentsService.list).mockResolvedValue([]);
    vi.mocked(commentsService.create).mockRejectedValue(
      new Error("Falha ao comentar"),
    );
    mockNotificationService();
    const user = userEvent.setup();

    renderWithProviders(<CommentTimeline ticketId="ticket-1" />, {
      user: makeUser("AGENT"),
    });

    await screen.findByText("Nenhum comentário ainda");
    await user.type(screen.getByRole("textbox"), "Conteúdo do comentário");
    await user.click(screen.getByRole("button", { name: /comentar/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
