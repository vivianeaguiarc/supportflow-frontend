import { describe, expect, it } from "vitest";

import { LoadingState } from "@/components/ui/loading-state";
import { render, screen } from "@/test/test-utils";

describe("LoadingState", () => {
  it("expõe um status acessível com o rótulo padrão", () => {
    render(<LoadingState />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Carregando...");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("aceita um rótulo customizado", () => {
    render(<LoadingState label="Buscando chamados..." />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Buscando chamados...",
    );
  });
});
