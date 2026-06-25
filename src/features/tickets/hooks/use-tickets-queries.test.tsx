import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useTicket } from "@/features/tickets/hooks/use-ticket";
import { useTickets } from "@/features/tickets/hooks/use-tickets";
import { ticketsService } from "@/features/tickets/services/tickets-service";
import { makePaginatedTickets, makeTicket } from "@/test/fixtures";
import { createQueryWrapper, mockApiError } from "@/test/test-utils";

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

describe("useTickets", () => {
  it("começa em loading e resolve com a lista paginada", async () => {
    const page = makePaginatedTickets([makeTicket(), makeTicket({ id: "t2" })]);
    vi.mocked(ticketsService.list).mockResolvedValue(page);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTickets(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(2);
    expect(ticketsService.list).toHaveBeenCalledWith({});
  });

  it("repassa os filtros para o service", async () => {
    vi.mocked(ticketsService.list).mockResolvedValue(makePaginatedTickets());
    const { wrapper } = createQueryWrapper();

    renderHook(() => useTickets({ status: "OPEN", page: 2 }), { wrapper });

    await waitFor(() =>
      expect(ticketsService.list).toHaveBeenCalledWith({
        status: "OPEN",
        page: 2,
      }),
    );
  });

  it("expõe o estado de erro quando o service falha", async () => {
    const error = mockApiError(500);
    vi.mocked(ticketsService.list).mockRejectedValue(error);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTickets(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
  });
});

describe("useTicket", () => {
  it("busca o detalhe pelo id", async () => {
    const ticket = makeTicket({ id: "ticket-42" });
    vi.mocked(ticketsService.getById).mockResolvedValue(ticket);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTicket("ticket-42"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(ticket);
    expect(ticketsService.getById).toHaveBeenCalledWith("ticket-42");
  });

  it("não dispara a query quando o id é vazio (enabled=false)", async () => {
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTicket(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(ticketsService.getById).not.toHaveBeenCalled();
  });
});
