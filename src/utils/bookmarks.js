export const BOOKMARK_STORAGE_KEY = "perrin-bookmarks-v1";
export const BOOKMARK_ICONS = ["link", "book", "github", "bot", "cloud", "search", "play", "code", "globe", "music", "mail"];

export function normalizeBookmark(item) {
  if (!item || typeof item !== "object") return null;
  const name = String(item.name || "").trim().slice(0, 28);
  const link = String(item.link || "").trim();
  if (!name || link.length > 2048) return null;
  try {
    const url = new URL(link);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname) return null;
    return { name, link: url.href, icon: BOOKMARK_ICONS.includes(item.icon) ? item.icon : "link" };
  } catch { return null; }
}
export function loadBookmarks(storage, defaults) {
  const initial = defaults.map(normalizeBookmark).filter(Boolean);
  try {
    const raw = storage.getItem(BOOKMARK_STORAGE_KEY);
    if (raw === null) return initial;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 40).map(normalizeBookmark).filter(Boolean) : initial;
  } catch { return initial; }
}
export function saveBookmarks(storage, items) {
  const normalized = items.slice(0, 40).map(normalizeBookmark).filter(Boolean);
  try { storage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(normalized)); } catch { /* Private mode */ }
  return normalized;
}
