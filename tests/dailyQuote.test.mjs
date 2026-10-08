import test from "node:test";
import assert from "node:assert/strict";
import { maoQuotes } from "../src/assets/maoQuotes.js";
import { getDailyQuote, displayQuotes, MAX_DAILY_QUOTE_LENGTH } from "../src/utils/dailyQuote.js";

test("daily quote stays fixed through the same local calendar day", () => {
  assert.equal(getDailyQuote(new Date(2026, 9, 8, 0, 0)), getDailyQuote(new Date(2026, 9, 8, 23, 59)));
});

test("daily quote covers the full collection before repeating", () => {
  const start = new Date(2026, 9, 8, 12, 0);
  const utcDay = Math.floor(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) / 86_400_000);
  start.setDate(start.getDate() - utcDay % displayQuotes.length);
  const values = Array.from({ length: displayQuotes.length }, (_, offset) => {
    const day = new Date(start);
    day.setDate(day.getDate() + offset);
    return getDailyQuote(day);
  });
  assert.equal(new Set(values).size, displayQuotes.length);
  assert.ok(values.every(value => displayQuotes.includes(value)));
});

test("daily quote does not repeat at cycle boundaries", () => {
  const start = new Date(2026, 0, 1, 12, 0);
  const values = Array.from({ length: displayQuotes.length * 10 }, (_, offset) => {
    const day = new Date(start);
    day.setDate(day.getDate() + offset);
    return getDailyQuote(day);
  });
  for (let i = 1; i < values.length; i++) assert.notEqual(values[i], values[i - 1]);
});

test("daily quote is selected from an offline local collection", () => {
  assert.ok(displayQuotes.length >= 12);
  assert.equal(new Set(maoQuotes).size, maoQuotes.length);
  assert.equal(new Set(displayQuotes).size, displayQuotes.length);
  assert.ok(maoQuotes.every(quote => typeof quote === "string" && quote.trim()));
  assert.ok(displayQuotes.every(quote => [...quote].length <= MAX_DAILY_QUOTE_LENGTH));
  assert.ok(maoQuotes.length > displayQuotes.length, "full-length originals stay in the source collection");
});
