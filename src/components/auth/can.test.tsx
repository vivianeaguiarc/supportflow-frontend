import { describe, expect, it } from "vitest";

import { Can } from "@/components/auth/can";
import { makeUser, renderWithProviders, screen } from "@/test/test-utils";

describe("Can (RBAC visual)", () => {
  it("renderiza os filhos quando a role tem a permissão", () => {
    renderWithProviders(
      <Can perform="analytics:view">
        <p>painel</p>
      </Can>,
      { user: makeUser("ADMIN") },
    );

    expect(screen.getByText("painel")).toBeInTheDocument();
  });

  it("renderiza o fallback quando a role não tem a permissão", () => {
    renderWithProviders(
      <Can perform="analytics:view" fallback={<p>sem acesso</p>}>
        <p>painel</p>
      </Can>,
      { user: makeUser("AGENT") },
    );

    expect(screen.getByText("sem acesso")).toBeInTheDocument();
    expect(screen.queryByText("painel")).not.toBeInTheDocument();
  });

  it("mode='all' exige todas as permissões", () => {
    renderWithProviders(
      <Can perform={["tickets:view", "tickets:assign"]} mode="all">
        <p>ações</p>
      </Can>,
      { user: makeUser("SUPERVISOR") },
    );

    expect(screen.getByText("ações")).toBeInTheDocument();
  });

  it("mode='any' basta uma permissão", () => {
    renderWithProviders(
      <Can perform={["analytics:view", "tickets:view"]}>
        <p>conteúdo</p>
      </Can>,
      { user: makeUser("AGENT") },
    );

    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("usuário deslogado não vê o conteúdo protegido", () => {
    renderWithProviders(
      <Can perform="tickets:view" fallback={<p>negado</p>}>
        <p>lista</p>
      </Can>,
      { user: null },
    );

    expect(screen.getByText("negado")).toBeInTheDocument();
  });
});
