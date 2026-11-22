import { describe, expect, it } from "vitest";
import { ApiError, errorMessage } from "./client.js";

describe("errorMessage", () => {
  it("returns the detail message from the API", () => {
    expect(errorMessage({ data: { detail: "Incorrect email or password." } })).toBe("Incorrect email or password.");
  });

  it("joins field validation errors", () => {
    const error = { data: { title: ["This field is required."], ends_at: "End must be later than start" } };
    expect(errorMessage(error)).toBe("title: This field is required. ends_at: End must be later than start");
  });

  it("falls back to the error message when there is no data", () => {
    expect(errorMessage(new Error("Network down"))).toBe("Network down");
  });

  it("has a default message", () => {
    expect(errorMessage(undefined)).toBe("Something went wrong.");
  });
});

describe("ApiError", () => {
  it("keeps the status code and builds the message from the response", () => {
    const error = new ApiError(409, { detail: "Conflict" });
    expect(error.status).toBe(409);
    expect(error.message).toBe("Conflict");
  });
});
