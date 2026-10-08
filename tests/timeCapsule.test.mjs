import test from "node:test";
import assert from "node:assert/strict";
import { getTimeCapsule } from "../src/utils/getTime.js";

test("Monday is the start of the week", () => {
  const result = getTimeCapsule(new Date(2026, 0, 5, 0, 0, 0));
  assert.equal(result.week.total, 7);
  assert.equal(result.week.passed, 0);
  assert.equal(result.week.remaining, 7);
});
test("Sunday belongs to the same week and not next week", () => {
  const result = getTimeCapsule(new Date(2026, 0, 11, 12, 0, 0));
  assert.equal(result.week.passed, 6);
  assert.equal(result.week.remaining, 1);
});
test("Leap-year February has 29 days", () => {
  const result = getTimeCapsule(new Date(2024, 1, 29, 12, 0, 0));
  assert.equal(result.month.total, 29);
  assert.equal(result.year.total, 366);
  assert.ok(Number(result.month.percentage) > 98);
});
test("Progress is bounded and day starts at zero", () => {
  const midnight = getTimeCapsule(new Date(2026, 9, 8, 0, 0, 0));
  assert.equal(midnight.day.passed, 0);
  assert.equal(midnight.day.percentage, "0.00");
  const evening = getTimeCapsule(new Date(2026, 9, 8, 23, 59, 59));
  assert.equal(evening.day.passed, 23);
  assert.ok(Number(evening.day.percentage) >= 99);
  for (const period of Object.values(evening)) {
    assert.ok(Number(period.percentage) >= 0 && Number(period.percentage) <= 100);
  }
});
