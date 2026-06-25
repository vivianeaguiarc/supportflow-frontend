import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { dashboardKeys } from "@/features/dashboard/hooks";
import { ticketsKeys } from "@/features/tickets/hooks/tickets-keys";
import { useAssignTicket } from "@/features/tickets/hooks/use-assign-ticket";
import { useCreateTicket } from "@/features/tickets/hooks/use-create-ticket";
import { useUpdateTicketStatus } from "@/features/tickets/hooks/use-update-ticket-status";
import { ticketsService } from "@/features/tickets/services/tickets-service";
import { MESSAGES } from "@/lib/notifications";
import { makeTicket } from "@/test/fixtures";
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

describe("useCreateTicket", () => {
  const payload = {
    title: "Novo chamado",
    description: "Descrição do problema",
    customerId: "customer-1",
  };

  it("cria o ticket, invalida caches e notifica sucesso", async () => {
    const ticket = makeTicket();
    vi.mocked(ticketsService.create).mockResolvedValue(ticket);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateTicket(), { wrapper });
    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ticketsService.create).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ticketsKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardKeys.all });
    expect(notifications.success).toHaveBeenCalledWith(MESSAGES.ticket.created);
  });

  it("trata erro com getErrorMessage e notifica via apiError", async () => {
    const error = mockApiError(400, "Dados inválidos");
    vi.mocked(ticketsService.create).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCreateTicket(), { wrapper });
    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.errorMessage).toBe("Dados inválidos");
    expect(notifications.apiError).toHaveBeenCalledWith(error, undefined);
  });
});

describe("useUpdateTicketStatus", () => {
  it("envia o payload, atualiza o detalhe e invalida as listas", async () => {
    const ticket = makeTicket({ id: "ticket-1", status: "RESOLVED" });
    vi.mocked(ticketsService.updateStatus).mockResolvedValue(ticket);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateTicketStatus(), { wrapper });
    act(() => result.current.mutate({ id: "ticket-1", status: "RESOLVED" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ticketsService.updateStatus).toHaveBeenCalledWith("ticket-1", {
      status: "RESOLVED",
    });
    expect(queryClient.getQueryData(ticketsKeys.detail("ticket-1"))).toEqual(
      ticket,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.detail("ticket-1"),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.summary(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.metrics(),
    });
    expect(notifications.success).toHaveBeenCalledWith(
      MESSAGES.ticket.statusUpdated,
    );
  });

  it("usa meta.errorMessage no toast de erro", async () => {
    const error = mockApiError(409);
    vi.mocked(ticketsService.updateStatus).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useUpdateTicketStatus(), { wrapper });
    act(() => result.current.mutate({ id: "ticket-1", status: "CLOSED" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(notifications.apiError).toHaveBeenCalledWith(
      error,
      MESSAGES.error.ticketUpdate,
    );
  });
});

describe("useAssignTicket", () => {
  it("atribui o responsável e notifica sucesso", async () => {
    const ticket = makeTicket({ id: "ticket-1", assignedToId: "agent-9" });
    vi.mocked(ticketsService.assign).mockResolvedValue(ticket);
    const notifications = mockNotificationService();
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAssignTicket(), { wrapper });
    act(() => result.current.mutate({ id: "ticket-1", agentId: "agent-9" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ticketsService.assign).toHaveBeenCalledWith("ticket-1", {
      agentId: "agent-9",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ticketsKeys.detail("ticket-1"),
    });
    expect(notifications.success).toHaveBeenCalledWith(
      MESSAGES.ticket.assigned,
    );
  });

  it("expõe errorMessage e notifica apiError quando falha", async () => {
    const error = mockApiError(500, "Falha ao atribuir");
    vi.mocked(ticketsService.assign).mockRejectedValue(error);
    const notifications = mockNotificationService();
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useAssignTicket(), { wrapper });
    act(() => result.current.mutate({ id: "ticket-1", agentId: "agent-9" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.errorMessage).toBe("Falha ao atribuir");
    expect(notifications.apiError).toHaveBeenCalledWith(error, undefined);
  });
});
