import { describe, expect, it } from "vitest";
import { errorMessage } from "./client.js";

describe("errorMessage", () => {
  it("returns the detail message from the API", () => {
    expect(errorMessage({ data: { detail: "Incorrect email or password." } })).toBe("Incorrect email or password.");
  });
});
