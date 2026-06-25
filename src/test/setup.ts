import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, vi } from "vitest";

/**
 * Setup global dos testes (Vitest + jsdom).
 *
 * - Estende `expect` com os matchers do jest-dom.
 * - Faz cleanup do DOM entre testes (globals desativado → manual).
 * - Mocka APIs do Next App Router e do browser que não existem no jsdom.
 */

// App Router não é montado em jsdom: stub de `next/navigation` e `next/link`.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("next/link", async () => {
  const { createElement } = await import("react");
  return {
    default: ({
      href,
      children,
      ...rest
    }: {
      href?: string;
      children?: ReactNode;
    } & Record<string, unknown>) =>
      createElement(
        "a",
        { href: typeof href === "string" ? href : "#", ...rest },
        children,
      ),
  };
});

afterEach(() => {
  cleanup();
});

// `matchMedia` (next-themes e media queries) não existe no jsdom.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// `ResizeObserver` é usado por componentes do Base UI.
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// `scrollIntoView` não é implementado no jsdom.
Element.prototype.scrollIntoView = vi.fn();
