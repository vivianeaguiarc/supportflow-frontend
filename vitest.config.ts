import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    clearMocks: true,
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:3333/api",
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/test/**",
        "src/**/*.d.ts",
        "src/**/index.ts",
      ],
      // Thresholds iniciais realistas, escopados aos módulos efetivamente
      // exercitados por esta suíte. Os globs por arquivo cobrem os hooks de
      // tickets já testados; a pasta inteira ainda tem hooks de query sem teste
      // (summary, metrics, lookups) que serão cobertos em iterações futuras.
      thresholds: {
        "src/features/tickets/hooks/use-tickets.ts": {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
        "src/features/tickets/hooks/use-ticket.ts": {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
        "src/features/tickets/hooks/use-create-ticket.ts": {
          statements: 90,
          branches: 70,
          functions: 90,
          lines: 90,
        },
        "src/features/tickets/hooks/use-update-ticket-status.ts": {
          statements: 90,
          branches: 70,
          functions: 90,
          lines: 90,
        },
        "src/features/tickets/hooks/use-assign-ticket.ts": {
          statements: 90,
          branches: 70,
          functions: 90,
          lines: 90,
        },
        "src/features/tickets/hooks/use-bulk-ticket-operations.ts": {
          statements: 90,
          branches: 70,
          functions: 90,
          lines: 90,
        },
        "src/lib/permissions.ts": {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
});
