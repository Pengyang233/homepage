import test from "node:test";
import { readFileSync } from "node:fs";
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

test("published shortcuts match the two-row homepage layout and have registered icons", () => {
  const shortcuts = JSON.parse(readFileSync(new URL("../src/assets/siteLinks.json", import.meta.url), "utf8"));
  assert.deepEqual(shortcuts.map(item => item.name), [
    "Blog", "Quant", "Jarvis", "Nexus", "ChatGPT", "Gemini", "Cloudflare", "Bilibili"
  ]);
  assert.deepEqual(shortcuts.map(item => item.link), [
    "https://blog.hyperrin.com/", "https://quant.hyperrin.com/",
    "https://jarvis.hyperrin.com/", "https://octopus.hyperrin.com/",
    "https://chatgpt.com/", "https://gemini.google.com/",
    "https://dash.cloudflare.com/", "https://www.bilibili.com/"
  ]);
  for (const item of shortcuts) {
    assert.equal(normalizeBookmark(item)?.icon, item.icon, `Unsupported icon: ${item.name}`);
  }
});
