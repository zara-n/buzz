import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("has a level-one heading naming the app", () => {
    expect.hasAssertions();
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Buzz" }),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    expect.hasAssertions();
    const { container } = render(<Home />);
    await expect(container).toHaveNoAxeViolations();
  });
});
