import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBookmark, loadBookmarks, saveBookmarks, BOOKMARK_STORAGE_KEY } from "../src/utils/bookmarks.js";

test("rejects invalid and unsafe bookmark URLs", () => {
  assert.equal(normalizeBookmark({ name: "bad", link: "javascript:alert(1)" }), null);
  assert.equal(normalizeBookmark({ name: "bad", link: "file:///etc/passwd" }), null);
  assert.equal(normalizeBookmark({ name: "", link: "https://example.com" }), null);
  assert.deepEqual(normalizeBookmark({ name: "Link", link: "https://example.com", icon: "unknown" }), {
    name: "Link", link: "https://example.com/", icon: "link"
  });
});
test("saved bookmarks override defaults; malformed storage falls back", () => {
  const data = new Map();
  const storage = { getItem: key => data.has(key) ? data.get(key) : null, setItem: (key, val) => data.set(key, val) };
  const defaults = [{ name: "Blog", link: "https://blog.hyperrin.com/", icon: "book" }];
  assert.equal(loadBookmarks(storage, defaults).length, 1);
  saveBookmarks(storage, [{ name: "Custom", link: "https://example.org/", icon: "globe" }]);
  assert.equal(loadBookmarks(storage, defaults)[0].name, "Custom");
  data.set(BOOKMARK_STORAGE_KEY, "not-json");
  assert.equal(loadBookmarks(storage, defaults)[0].name, "Blog");
});

test("legacy default site icons upgrade without overriding custom bookmarks", () => {
  assert.equal(normalizeBookmark({ name: "ChatGPT", link: "https://chatgpt.com/", icon: "bot" }).icon, "chatgpt");
  assert.equal(normalizeBookmark({ name: "Cloudflare", link: "https://dash.cloudflare.com/", icon: "cloud" }).icon, "cloudflare");
  assert.equal(normalizeBookmark({ name: "Google", link: "https://www.google.com/", icon: "search" }).icon, "google");
  assert.equal(normalizeBookmark({ name: "Bilibili", link: "https://www.bilibili.com/", icon: "play" }).icon, "bilibili");
  assert.equal(normalizeBookmark({ name: "Personal", link: "https://chatgpt.com/", icon: "bot" }).icon, "bot");
  assert.equal(normalizeBookmark({ name: "ChatGPT", link: "https://chatgpt.com/", icon: "code" }).icon, "code");
});
