import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/*
 * Tests for the test tooling itself. If the matcher silently passed
 * everything, every accessibility assertion in the suite would be worthless.
 */
describe("toHaveNoAxeViolations", () => {
  it("passes for accessible markup", async () => {
    const { container } = render(
      <label>
        Company
        <input type="text" />
      </label>,
    );
    await expect(container).toHaveNoAxeViolations();
  });

  it("fails for an unlabelled input", async () => {
    const { container } = render(<input type="text" />);
    await expect(expect(container).toHaveNoAxeViolations()).rejects.toThrow(
      /label/,
    );
  });
});
