import { describe, expect, it } from "vitest";

import { PriorityBadge } from "@/components/ui/priority-badge";
import { render, screen } from "@/test/test-utils";

describe("PriorityBadge", () => {
  it("usa o rótulo pt-BR padrão por nível", () => {
    render(<PriorityBadge level="low" />);

    expect(screen.getByText("Baixa")).toBeInTheDocument();
  });

  it("mapeia urgente para o tom de perigo (rose)", () => {
    render(<PriorityBadge level="urgent" />);

    expect(screen.getByText("Urgente").className).toContain("rose");
  });

  it("permite sobrescrever o rótulo", () => {
    render(<PriorityBadge level="high" label="Prioritário" />);

    expect(screen.getByText("Prioritário")).toBeInTheDocument();
    expect(screen.queryByText("Alta")).not.toBeInTheDocument();
  });
});
