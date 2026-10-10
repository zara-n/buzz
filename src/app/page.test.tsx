import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

/*
 * Skeleton: Zara writes the assertions.
 * `expect.hasAssertions()` makes each test fail until it asserts something,
 * so an unfinished test can't pass by doing nothing.
 */
describe("Home page", () => {
  it("has a level-one heading naming the app", () => {
    expect.hasAssertions();
    render(<Home />);

    // TODO(Zara): query the heading by role and level (import `screen`),
    // then assert its accessible name.
  });

  it("has no axe violations", () => {
    expect.hasAssertions();
    render(<Home />);

    // TODO(Zara): keep `container` from render(), make this test async,
    // and await the custom `toHaveNoAxeViolations()` matcher.
  });
});
