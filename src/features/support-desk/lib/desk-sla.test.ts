import { describe, expect, it } from "vitest";

import type { Ticket } from "@/types/ticket";

import { formatSlaCountdown, getSlaState } from "./desk-sla";

const NOW = new Date("2026-01-01T12:00:00.000Z");

function buildTicket(
  overrides: Partial<Ticket>,
): Pick<Ticket, "status" | "slaDueAt"> {
  return {
    status: "OPEN",
    slaDueAt: NOW.toISOString(),
    ...overrides,
  };
}

describe("getSlaState", () => {
  it("retorna 'none' para status terminais", () => {
    const resolved = buildTicket({
      status: "RESOLVED",
      slaDueAt: new Date(NOW.getTime() - 60 * 60 * 1000).toISOString(),
    });
    const closed = buildTicket({
      status: "CLOSED",
      slaDueAt: new Date(NOW.getTime() - 60 * 60 * 1000).toISOString(),
    });

    expect(getSlaState(resolved, NOW)).toBe("none");
    expect(getSlaState(closed, NOW)).toBe("none");
  });

  it("retorna 'breached' quando o prazo já passou", () => {
    const ticket = buildTicket({
      slaDueAt: new Date(NOW.getTime() - 60 * 1000).toISOString(),
    });
    expect(getSlaState(ticket, NOW)).toBe("breached");
  });

  it("retorna 'warning' quando vence dentro da janela de 24h", () => {
    const ticket = buildTicket({
      slaDueAt: new Date(NOW.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    });
    expect(getSlaState(ticket, NOW)).toBe("warning");
  });

  it("retorna 'ok' quando há folga maior que a janela de alerta", () => {
    const ticket = buildTicket({
      slaDueAt: new Date(NOW.getTime() + 48 * 60 * 60 * 1000).toISOString(),
    });
    expect(getSlaState(ticket, NOW)).toBe("ok");
  });

  it("retorna 'none' para prazo inválido", () => {
    const ticket = buildTicket({ slaDueAt: "" });
    expect(getSlaState(ticket, NOW)).toBe("none");
  });
});

describe("formatSlaCountdown", () => {
  it("formata prazo futuro em horas", () => {
    const due = new Date(NOW.getTime() + 3 * 60 * 60 * 1000).toISOString();
    expect(formatSlaCountdown(due, NOW)).toBe("vence em 3h");
  });

  it("formata prazo futuro em minutos quando falta menos de 1h", () => {
    const due = new Date(NOW.getTime() + 45 * 60 * 1000).toISOString();
    expect(formatSlaCountdown(due, NOW)).toBe("vence em 45min");
  });

  it("formata atraso", () => {
    const due = new Date(NOW.getTime() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatSlaCountdown(due, NOW)).toBe("atrasado 2h");
  });
});
