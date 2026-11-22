import { describe, expect, it } from "vitest";
import { canReport, monthGrid, monthParam } from "./calendar.js";

describe("monthParam", () => {
  it("formats the month as YYYY-MM with a leading zero", () => {
    expect(monthParam(2026, 0)).toBe("2026-01");
  });
});

describe("monthGrid", () => {
  it("splits the month into full weeks of 7 days", () => {
    const weeks = monthGrid(2026, 10); // November 2026
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks.flat().filter(Boolean)).toHaveLength(30);
  });
});

describe("canReport", () => {
  const now = new Date(2026, 10, 22, 12, 0);
  const assignment = (status, startsAt) => ({ status, lesson: { starts_at: startsAt.toISOString() } });

  it("allows reporting for a past lesson", () => {
    expect(canReport(assignment("ASSIGNED", new Date(2026, 10, 20, 9)), now)).toBe(true);
  });

  it("does not allow reporting for a future lesson", () => {
    expect(canReport(assignment("ASSIGNED", new Date(2026, 10, 23, 9)), now)).toBe(false);
  });
});
