import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { dashboardKeys } from "@/features/dashboard/hooks";
import { ticketsKeys } from "@/features/tickets/hooks/tickets-keys";
import {
  useBulkAssignTickets,
  useBulkUpdateTicketStatus,
} from "@/features/tickets/hooks/use-bulk-ticket-operations";
import { ticketsService } from "@/features/tickets/services/tickets-service";
import { makeBulkResult } from "@/test/fixtures";
import {
  createQueryWrapper,
  mockApiError,
  mockNotificationService,
} from "@/test/test-utils";

vi.mock("@/features/tickets/services/tickets-service", () => ({
  ticketsService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    assign: vi.fn(),
    bulkUpdateStatus: vi.fn(),
    bulkAssign: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useBulkUpdateTicketStatus", () => {
  const payload = {
    ticketIds: ["ticket-1", "ticket-2"],
    status: "CLOSED" as const,
  };

  it("envia o lote, invalida listas/detalhes e notifica o total atualizado", async () => {
    const resultData = makeBulkResult({
      totalUpdated: 2,
      updatedTicketIds: ["ticket-1", "ticket-2"],
    });
    vi.mocked(ticketsService.bulkUpdateStatus).mockResolvedValue(resultData);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useBulkUpdateTicketStatus(), {
      wrapper,
    });
    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ticketsService.bulkUpdateStatus).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.summary(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.metrics(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.detail("ticket-1"),
    });
    expect(notifications.success).toHaveBeenCalledWith(
      "2 chamados atualizados.",
    );
  });

  it("notifica erro quando o lote falha", async () => {
    const error = mockApiError(403);
    vi.mocked(ticketsService.bulkUpdateStatus).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useBulkUpdateTicketStatus(), {
      wrapper,
    });
    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(notifications.apiError).toHaveBeenCalledWith(error, undefined);
  });
});

describe("useBulkAssignTickets", () => {
  it("atribui em lote e pluraliza a mensagem para 1 chamado", async () => {
    const resultData = makeBulkResult({
      totalRequested: 1,
      totalUpdated: 1,
      updatedTicketIds: ["ticket-1"],
      operation: "bulk_assign",
    });
    vi.mocked(ticketsService.bulkAssign).mockResolvedValue(resultData);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useBulkAssignTickets(), { wrapper });
    act(() =>
      result.current.mutate({
        ticketIds: ["ticket-1"],
        assignedToId: "agent-1",
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ticketsService.bulkAssign).toHaveBeenCalledWith({
      ticketIds: ["ticket-1"],
      assignedToId: "agent-1",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardKeys.all });
    expect(notifications.success).toHaveBeenCalledWith("1 chamado atualizado.");
  });
});
