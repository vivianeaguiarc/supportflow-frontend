import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/ui/empty-state";
import { render, screen } from "@/test/test-utils";

describe("EmptyState", () => {
  it("renderiza título e descrição", () => {
    render(<EmptyState title="Nada por aqui" description="Sem registros." />);

    expect(screen.getByText("Nada por aqui")).toBeInTheDocument();
    expect(screen.getByText("Sem registros.")).toBeInTheDocument();
  });

  it("renderiza a ação quando fornecida", () => {
    render(
      <EmptyState
        title="Vazio"
        action={<button type="button">Criar</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
  });

  it("não renderiza ação quando ausente", () => {
    render(<EmptyState title="Somente título" />);

    expect(screen.getByText("Somente título")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
