import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "./axe-matcher";

// Unmount rendered components between tests so DOM state never leaks.
afterEach(() => {
  cleanup();
});
