import AxeBuilder from "@axe-core/playwright";
import { test as base } from "@playwright/test";

/*
 * Every e2e test imports `test` from here instead of @playwright/test, so
 * `makeAxeBuilder()` always checks the same standard: WCAG 2.0–2.2, A and AA.
 * Unlike the unit-test matcher, this runs in a real browser, so
 * color-contrast and landmark (region) rules are on.
 */
export const WCAG_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
];

type Fixtures = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<Fixtures>({
  // Playwright calls this parameter `use`; renamed so React's rules-of-hooks
  // lint doesn't mistake it for React 19's `use` hook.
  makeAxeBuilder: async ({ page }, provide) => {
    await provide(() => new AxeBuilder({ page }).withTags(WCAG_TAGS));
  },
});

export { expect } from "@playwright/test";
