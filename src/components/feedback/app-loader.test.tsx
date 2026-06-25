import { describe, expect, it } from "vitest";

import { AppLoader } from "@/components/feedback";
import { render, screen } from "@/test/test-utils";

describe("AppLoader", () => {
  it("é acessível e mostra o rótulo padrão", () => {
    render(<AppLoader />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Carregando...");
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("aceita rótulo customizado", () => {
    render(<AppLoader label="Carregando sua sessão..." />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando sua sessão...",
    );
  });

  it("ocupa a tela inteira no modo fullScreen", () => {
    render(<AppLoader fullScreen />);

    expect(screen.getByRole("status")).toHaveClass("min-h-screen");
  });
});
