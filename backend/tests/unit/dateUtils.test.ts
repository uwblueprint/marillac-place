import assert from "node:assert/strict";
import test from "node:test";
import { DayOfWeek } from "@prisma/client";

import {
  combineDayAndTime,
  getEndOfDay,
  getStartOfDay,
  whichDay,
} from "../../utils/dateUtils";

test("combineDayAndTime merges day and clock", () => {
  const day = new Date("2026-03-24T00:00:00.000Z");
  const time = new Date("2026-01-01T15:45:10.250Z");
  const merged = combineDayAndTime(day, time);

  assert.equal(merged.getFullYear(), day.getFullYear());
  assert.equal(merged.getMonth(), day.getMonth());
  assert.equal(merged.getDate(), day.getDate());
  assert.equal(merged.getHours(), time.getHours());
  assert.equal(merged.getMinutes(), time.getMinutes());
});

test("start and end of day are ordered", () => {
  const input = new Date("2026-03-24T14:32:00.000Z");
  const start = getStartOfDay(input);
  const end = getEndOfDay(input);

  assert.ok(start.getTime() <= end.getTime());
});

test("whichDay returns known enum value", () => {
  const day = whichDay(new Date("2026-03-24T14:32:00.000Z"));
  assert.ok(Object.values(DayOfWeek).includes(day));
});
