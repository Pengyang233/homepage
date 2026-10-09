import test from "node:test";
import assert from "node:assert/strict";
import { resolveNavigation, SEARCH_ENGINES } from "../src/utils/quickSearch.js";

test("search terms and safe addresses", () => {
  assert.equal(resolveNavigation(""), null);
  assert.equal(resolveNavigation("flow matching", "bing"), "https://www.bing.com/search?q=flow%20matching");
  assert.equal(resolveNavigation("flow matching", "yandex"), "https://yandex.com/search/?text=flow%20matching");
  assert.equal(resolveNavigation("中文 搜索", "google"), "https://www.google.com/search?q=%E4%B8%AD%E6%96%87%20%E6%90%9C%E7%B4%A2");
  assert.equal(resolveNavigation("github.com", "yandex"), "https://github.com/");
  assert.equal(resolveNavigation("http://localhost:3000"), "http://localhost:3000/");
  assert.equal(resolveNavigation("javascript:alert(1)"), "https://www.google.com/search?q=javascript%3Aalert(1)");
  assert.equal(resolveNavigation("test", "unknown"), "https://www.google.com/search?q=test");
});
test("supported engines exclude DuckDuckGo", () => {
  assert.deepEqual(Object.keys(SEARCH_ENGINES), ["google", "bing", "yandex"]);
});
