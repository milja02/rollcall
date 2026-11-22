import { describe, expect, it } from "vitest";
import { canReport, dayKey, monthGrid, monthParam, toLocalInput } from "./calendar.js";

describe("monthParam", () => {
  it("formats the month as YYYY-MM with a leading zero", () => {
    expect(monthParam(2026, 0)).toBe("2026-01");
    expect(monthParam(2026, 11)).toBe("2026-12");
  });
});

describe("dayKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(dayKey(new Date(2026, 2, 5))).toBe("2026-03-05");
  });
});

describe("monthGrid", () => {
  it("splits the month into full weeks of 7 days", () => {
    const weeks = monthGrid(2026, 10); // November 2026
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks.flat().filter(Boolean)).toHaveLength(30);
  });

  it("starts the week on Monday", () => {
    // 1 November 2026 is a Sunday, so it is the last cell of the first week
    const [firstWeek] = monthGrid(2026, 10);
    expect(firstWeek.slice(0, 6).every((cell) => cell === null)).toBe(true);
    expect(firstWeek[6].getDate()).toBe(1);
  });
});

describe("canReport", () => {
  const now = new Date(2026, 10, 22, 12, 0);
  const assignment = (status, startsAt) => ({ status, lesson: { starts_at: startsAt.toISOString() } });

  it("allows reporting for a past lesson", () => {
    expect(canReport(assignment("ASSIGNED", new Date(2026, 10, 20, 9)), now)).toBe(true);
  });

  it("allows reporting later on the same day", () => {
    expect(canReport(assignment("ASSIGNED", new Date(2026, 10, 22, 18)), now)).toBe(true);
  });

  it("does not allow reporting for a future lesson", () => {
    expect(canReport(assignment("ASSIGNED", new Date(2026, 10, 23, 9)), now)).toBe(false);
  });

  it("allows a rejected report to be sent again", () => {
    expect(canReport(assignment("REJECTED", new Date(2026, 10, 20, 9)), now)).toBe(true);
  });

  it("does not allow changing reported or confirmed attendance", () => {
    expect(canReport(assignment("REPORTED", new Date(2026, 10, 20, 9)), now)).toBe(false);
    expect(canReport(assignment("CONFIRMED", new Date(2026, 10, 20, 9)), now)).toBe(false);
  });
});

describe("toLocalInput", () => {
  it("formats a date for a datetime-local input", () => {
    expect(toLocalInput(new Date(2026, 0, 2, 8, 5).toISOString())).toBe("2026-01-02T08:05");
  });
});
