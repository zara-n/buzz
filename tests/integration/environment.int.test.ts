import { describe, expect, it } from "vitest";

describe("integration environment", () => {
  // Catches the integration project being misconfigured to run in jsdom,
  // where browser globals would hide bugs in server-only code.
  it("runs in Node without a DOM", () => {
    expect(typeof window).toBe("undefined");
  });
});
