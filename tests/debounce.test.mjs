import test from "node:test";
import assert from "node:assert/strict";
import debounce from "../src/utils/debounce.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("independent debounce instances do not cancel each other", async () => {
  const values = [];
  const first = debounce(() => values.push("first"), 10);
  const second = debounce(() => values.push("second"), 10);
  first();
  second();
  await sleep(40);
  assert.deepEqual(values.sort(), ["first", "second"]);
});

test("debounce executes only the latest arguments", async () => {
  const values = [];
  const delayed = debounce((value) => values.push(value), 10);
  delayed(1);
  delayed(2);
  await sleep(40);
  assert.deepEqual(values, [2]);
});

test("pending debounce can be canceled", async () => {
  let calls = 0;
  const delayed = debounce(() => { calls++; }, 10);
  delayed();
  delayed.cancel();
  await sleep(40);
  assert.equal(calls, 0);
});
