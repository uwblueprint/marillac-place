import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DayOfWeek } from "@prisma/client";
import { getEndOfDay, getStartOfDay, whichDay } from "../utils/dateUtils";

// Days are Toronto days, so their UTC bounds shift with daylight saving time.
describe("getStartOfDay / getEndOfDay", () => {
  const cases = [
    {
      name: "summer (EDT, UTC-4)",
      at: "2026-07-15T16:00:00.000Z",
      start: "2026-07-15T04:00:00.000Z",
      end: "2026-07-16T03:59:59.999Z",
    },
    {
      name: "winter (EST, UTC-5)",
      at: "2026-01-15T16:00:00.000Z",
      start: "2026-01-15T05:00:00.000Z",
      end: "2026-01-16T04:59:59.999Z",
    },
    {
      name: "late evening in Toronto, already the next day in UTC",
      at: "2026-07-16T02:30:00.000Z",
      start: "2026-07-15T04:00:00.000Z",
      end: "2026-07-16T03:59:59.999Z",
    },
    {
      name: "exactly midnight in Toronto",
      at: "2026-07-15T04:00:00.000Z",
      start: "2026-07-15T04:00:00.000Z",
      end: "2026-07-16T03:59:59.999Z",
    },
    {
      name: "last millisecond of a Toronto day",
      at: "2026-07-16T03:59:59.999Z",
      start: "2026-07-15T04:00:00.000Z",
      end: "2026-07-16T03:59:59.999Z",
    },
    {
      name: "spring-forward day is 23 hours",
      at: "2026-03-08T12:00:00.000Z",
      start: "2026-03-08T05:00:00.000Z",
      end: "2026-03-09T03:59:59.999Z",
    },
    {
      name: "last millisecond before spring-forward (1:59:59.999am EST)",
      at: "2026-03-08T06:59:59.999Z",
      start: "2026-03-08T05:00:00.000Z",
      end: "2026-03-09T03:59:59.999Z",
    },
    {
      name: "spring-forward instant (2am EST becomes 3am EDT)",
      at: "2026-03-08T07:00:00.000Z",
      start: "2026-03-08T05:00:00.000Z",
      end: "2026-03-09T03:59:59.999Z",
    },
    {
      name: "first 1:30am on fall-back day (EDT)",
      at: "2026-11-01T05:30:00.000Z",
      start: "2026-11-01T04:00:00.000Z",
      end: "2026-11-02T04:59:59.999Z",
    },
    {
      name: "repeated 1:30am on fall-back day (EST)",
      at: "2026-11-01T06:30:00.000Z",
      start: "2026-11-01T04:00:00.000Z",
      end: "2026-11-02T04:59:59.999Z",
    },
    {
      name: "fall-back day is 25 hours",
      at: "2026-11-01T12:00:00.000Z",
      start: "2026-11-01T04:00:00.000Z",
      end: "2026-11-02T04:59:59.999Z",
    },
  ];

  cases.forEach(({ name, at, start, end }) => {
    it(name, () => {
      assert.equal(getStartOfDay(new Date(at)).toISOString(), start);
      assert.equal(getEndOfDay(new Date(at)).toISOString(), end);
    });
  });
});

describe("whichDay", () => {
  it("uses the Toronto day, not the UTC day", () => {
    // Wednesday 10:30pm in Toronto is already Thursday in UTC.
    assert.equal(
      whichDay(new Date("2026-07-16T02:30:00.000Z")),
      DayOfWeek.WEDNESDAY
    );
    assert.equal(
      whichDay(new Date("2026-07-16T04:00:00.000Z")),
      DayOfWeek.THURSDAY
    );
  });
});
