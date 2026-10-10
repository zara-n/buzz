import axe, { type Result, type RunOptions } from "axe-core";
import { expect } from "vitest";

/*
 * `await expect(container).toHaveNoAxeViolations()` for component tests.
 *
 * Rules that can't work in jsdom are off here and covered by Playwright,
 * which runs axe in a real browser:
 * - color-contrast: jsdom does no layout or painting, so contrast is unknown.
 * - region: a lone component isn't inside a page's landmarks, by design.
 */
const componentRunOptions: RunOptions = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
  },
};

function formatViolations(violations: Result[]): string {
  return violations
    .map((v) => {
      const targets = v.nodes
        .map((n) => `    ${n.target.join(" ")}`)
        .join("\n");
      return `[${v.impact ?? "unknown"}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n${targets}`;
    })
    .join("\n\n");
}

expect.extend({
  async toHaveNoAxeViolations(received: Element, options?: RunOptions) {
    const results = await axe.run(received, {
      ...componentRunOptions,
      ...options,
    });
    const pass = results.violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "Expected axe violations, but found none."
          : `Expected no axe violations, found ${String(results.violations.length)}:\n\n${formatViolations(results.violations)}`,
    };
  },
});

declare module "vitest" {
  // Type parameters must match Vitest 5's own declaration of Matchers
  // (same names and defaults) for TypeScript to merge the two, even unused.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > {
    toHaveNoAxeViolations(options?: RunOptions): Promise<void>;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
