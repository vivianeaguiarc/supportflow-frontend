import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/test-utils";

import { UnreadNotificationsBadge } from "./unread-notifications-badge";

describe("UnreadNotificationsBadge", () => {
  it("não renderiza nada quando não há não lidas", () => {
    const { container } = render(<UnreadNotificationsBadge count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("exibe a contagem quando há não lidas", () => {
    render(<UnreadNotificationsBadge count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("satura em 9+ acima de 9", () => {
    render(<UnreadNotificationsBadge count={42} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });
});
