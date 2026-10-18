import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolve the `@/*` alias from tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        // Pure logic and components. Fast, no database, simulated DOM.
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}", "tests/setup/**/*.test.{ts,tsx}"],
          exclude: ["**/*.int.test.ts"],
          setupFiles: ["./tests/setup/unit.ts"],
        },
      },
      {
        // Repositories, services, actions against a real Postgres (#5).
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: [
            "src/**/*.int.test.ts",
            "tests/integration/**/*.int.test.ts",
          ],
          // Files share one database, so run them one at a time.
          fileParallelism: false,
        },
      },
    ],
  },
});
