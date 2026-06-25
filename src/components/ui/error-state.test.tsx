import { describe, expect, it, vi } from "vitest";

import { ErrorState } from "@/components/ui/error-state";
import { render, screen, userEvent } from "@/test/test-utils";

describe("ErrorState", () => {
  it("usa o título padrão e exibe a descrição", () => {
    render(<ErrorState description="Falha ao carregar." />);

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
    expect(screen.getByText("Falha ao carregar.")).toBeInTheDocument();
  });

  it("não exibe botão de retry quando onRetry não é passado", () => {
    render(<ErrorState description="Erro" />);

    expect(
      screen.queryByRole("button", { name: "Tentar novamente" }),
    ).not.toBeInTheDocument();
  });

  it("chama onRetry ao clicar no botão", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState description="Erro" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
