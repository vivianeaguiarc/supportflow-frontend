import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { attachmentsService } from "@/features/attachments/services/attachments-service";
import { ticketsKeys } from "@/features/tickets/hooks";
import { MESSAGES } from "@/lib/notifications";
import {
  createQueryWrapper,
  mockApiError,
  mockNotificationService,
} from "@/test/test-utils";
import type { TicketAttachmentWithUploader } from "@/types/attachment";

import { attachmentsKeys } from "./attachments-keys";
import { useTicketAttachments } from "./use-ticket-attachments";
import { useUploadTicketAttachment } from "./use-upload-ticket-attachment";

vi.mock("@/features/attachments/services/attachments-service", () => ({
  attachmentsService: {
    list: vi.fn(),
    upload: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

function makeAttachment(
  overrides: Partial<TicketAttachmentWithUploader> = {},
): TicketAttachmentWithUploader {
  return {
    id: "att-1",
    ticketId: "ticket-1",
    tenantId: "tenant-1",
    uploadedById: "user-1",
    fileName: "1700000000-comprovante.pdf",
    originalName: "comprovante.pdf",
    mimeType: "application/pdf",
    size: "245678",
    fileUrl: "/storage/attachments/1700000000-comprovante.pdf",
    createdAt: "2026-01-01T10:00:00.000Z",
    uploadedBy: { id: "user-1", name: "Maria", email: "maria@x.com" },
    ...overrides,
  };
}

describe("useTicketAttachments", () => {
  it("lista os anexos do ticket", async () => {
    vi.mocked(attachmentsService.list).mockResolvedValue([makeAttachment()]);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTicketAttachments("ticket-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(attachmentsService.list).toHaveBeenCalledWith("ticket-1");
  });

  it("não busca quando o ticketId é vazio", () => {
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTicketAttachments(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(attachmentsService.list).not.toHaveBeenCalled();
  });
});

describe("useUploadTicketAttachment", () => {
  it("envia, invalida anexos + histórico e notifica sucesso", async () => {
    vi.mocked(attachmentsService.upload).mockResolvedValue(makeAttachment());
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUploadTicketAttachment("ticket-1"), {
      wrapper,
    });

    const file = new File(["conteudo"], "comprovante.pdf", {
      type: "application/pdf",
    });
    act(() => result.current.mutate(file));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(attachmentsService.upload).toHaveBeenCalledWith("ticket-1", file);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: attachmentsKeys.list("ticket-1"),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.history("ticket-1"),
    });
    expect(notifications.success).toHaveBeenCalledWith(
      MESSAGES.attachment.uploaded,
    );
  });

  it("notifica erro quando o upload falha", async () => {
    const error = mockApiError(400);
    vi.mocked(attachmentsService.upload).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useUploadTicketAttachment("ticket-1"), {
      wrapper,
    });

    const file = new File(["x"], "a.pdf", { type: "application/pdf" });
    act(() => result.current.mutate(file));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(notifications.apiError).toHaveBeenCalledWith(error, undefined);
  });
});
