import { describe, expect, it } from "vitest";

import { AccessDenied } from "@/components/auth/access-denied";
import { render, screen } from "@/test/test-utils";

describe("AccessDenied", () => {
  it("mostra título e descrição padrão", () => {
    render(<AccessDenied />);

    expect(screen.getByText("Acesso negado")).toBeInTheDocument();
    expect(screen.getByText(/não tem permissão/i)).toBeInTheDocument();
  });

  it("renderiza link de retorno padrão para /tickets", () => {
    render(<AccessDenied />);

    expect(
      screen.getByRole("link", { name: "Voltar para os chamados" }),
    ).toHaveAttribute("href", "/tickets");
  });

  it("aceita título, descrição e link customizados", () => {
    render(
      <AccessDenied
        title="Sem acesso ao painel"
        description="Apenas administradores."
        homeHref="/dashboard"
        homeLabel="Ir ao dashboard"
      />,
    );

    expect(screen.getByText("Sem acesso ao painel")).toBeInTheDocument();
    expect(screen.getByText("Apenas administradores.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ir ao dashboard" }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
