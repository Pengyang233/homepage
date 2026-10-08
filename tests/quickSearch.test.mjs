import test from "node:test";
import assert from "node:assert/strict";
import { resolveNavigation } from "../src/utils/quickSearch.js";

test("search terms and safe addresses", () => {
  assert.equal(resolveNavigation(""), null);
  assert.equal(resolveNavigation("flow matching", "bing"), "https://www.bing.com/search?q=flow%20matching");
  assert.equal(resolveNavigation("github.com"), "https://github.com/");
  assert.equal(resolveNavigation("http://localhost:3000"), "http://localhost:3000/");
  assert.equal(resolveNavigation("javascript:alert(1)"), "https://www.google.com/search?q=javascript%3Aalert(1)");
  assert.equal(resolveNavigation("test", "unknown"), "https://www.google.com/search?q=test");
});
