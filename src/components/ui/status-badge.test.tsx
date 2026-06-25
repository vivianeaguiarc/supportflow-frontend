import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/ui/status-badge";
import { render, screen } from "@/test/test-utils";

describe("StatusBadge", () => {
  it("renderiza o rótulo", () => {
    render(<StatusBadge label="Aberto" />);

    expect(screen.getByText("Aberto")).toBeInTheDocument();
  });

  it("aplica as classes do tom semântico", () => {
    render(<StatusBadge label="Resolvido" tone="success" />);

    expect(screen.getByText("Resolvido").className).toContain("emerald");
  });

  it("mescla a className recebida", () => {
    render(<StatusBadge label="Custom" className="ring-test" />);

    expect(screen.getByText("Custom")).toHaveClass("ring-test");
  });
});
