import { afterEach, describe, expect, it } from "vitest";

import { OfflineBanner } from "@/components/feedback";
import { render, screen } from "@/test/test-utils";

function setOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    get: () => value,
  });
}

describe("OfflineBanner", () => {
  afterEach(() => {
    setOnline(true);
  });

  it("não renderiza nada quando online", () => {
    setOnline(true);
    render(<OfflineBanner />);

    expect(screen.queryByText(/sem conexão/i)).not.toBeInTheDocument();
  });

  it("avisa o usuário quando offline", () => {
    setOnline(false);
    render(<OfflineBanner />);

    const banner = screen.getByText(/sem conexão/i);
    expect(banner).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-live",
      "assertive",
    );
  });
});
