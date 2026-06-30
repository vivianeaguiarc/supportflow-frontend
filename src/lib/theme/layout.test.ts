import { describe, expect, it } from "vitest";

import { resolveBreadcrumbs, resolveRouteContext } from "@/lib/theme/layout";

describe("resolveRouteContext", () => {
  it("resolve rota operacional da mesa de atendimento", () => {
    expect(resolveRouteContext("/support-desk")).toEqual({
      label: "Mesa de Atendimento",
      area: "Operação",
    });
  });

  it("resolve sub-rota de tickets", () => {
    expect(resolveRouteContext("/tickets/abc-123")).toEqual({
      label: "Chamados",
      area: "Operação",
    });
  });

  it("resolve área administrativa de configurações", () => {
    expect(resolveRouteContext("/settings/sla")).toEqual({
      label: "Configurações",
      area: "Administração",
    });
  });

  it("retorna fallback para rota desconhecida", () => {
    expect(resolveRouteContext("/unknown")).toEqual({
      label: "SupportFlow",
      area: "Operação",
    });
  });
});

describe("resolveBreadcrumbs", () => {
  it("monta trilha para rota de chamados", () => {
    expect(resolveBreadcrumbs("/tickets")).toEqual([
      { label: "Início", href: "/dashboard" },
      { label: "Operação" },
      { label: "Chamados", href: "/tickets" },
    ]);
  });

  it("inclui detalhe em sub-rota de ticket", () => {
    expect(resolveBreadcrumbs("/tickets/abc-123")).toEqual([
      { label: "Início", href: "/dashboard" },
      { label: "Operação" },
      { label: "Chamados", href: "/tickets" },
      { label: "Detalhe" },
    ]);
  });

  it("monta trilha para configurações SLA", () => {
    expect(resolveBreadcrumbs("/settings/sla")).toEqual([
      { label: "Início", href: "/dashboard" },
      { label: "Administração" },
      { label: "Configurações", href: "/settings/sla" },
    ]);
  });
});
