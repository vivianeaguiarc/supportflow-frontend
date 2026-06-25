import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GlobalErrorBoundary } from "@/components/feedback";
import { render, screen } from "@/test/test-utils";

function Boom(): never {
  throw new Error("falha-de-render");
}

describe("GlobalErrorBoundary", () => {
  beforeEach(() => {
    // React loga o erro capturado pelo boundary; silenciamos no teste.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza os filhos quando não há erro", () => {
    render(
      <GlobalErrorBoundary>
        <p>conteúdo ok</p>
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText("conteúdo ok")).toBeInTheDocument();
  });

  it("mostra o fallback padrão ao capturar um erro de render", () => {
    render(
      <GlobalErrorBoundary>
        <Boom />
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tentar novamente" }),
    ).toBeInTheDocument();
  });

  it("usa o fallback customizado recebendo o erro", () => {
    render(
      <GlobalErrorBoundary
        fallback={({ error }) => <p>Capturado: {error.message}</p>}
      >
        <Boom />
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText("Capturado: falha-de-render")).toBeInTheDocument();
  });
});
