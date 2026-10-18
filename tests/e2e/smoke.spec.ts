import { expect, test } from "./fixtures";

// Catches the app failing to build or serve, and proves the e2e + axe
// wiring works end to end. Real flows arrive in #18.
test("home page loads with no WCAG A/AA violations", async ({
  page,
  makeAxeBuilder,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Buzz");

  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toEqual([]);
});
