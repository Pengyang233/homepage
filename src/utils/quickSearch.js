export const SEARCH_ENGINES = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
};

export function resolveNavigation(value, engine = "google") {
  const input = String(value ?? "").trim();
  if (!input) return null;

  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      if (["http:", "https:"].includes(url.protocol) && url.hostname) return url.href;
    } catch { /* Search invalid URLs as text. */ }
  } else if (!/\s/.test(input) && /^(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|[a-z\d-]+(?:\.[a-z\d-]+)+)(?::\d{1,5})?(?:[/?#].*)?$/i.test(input)) {
    try {
      const url = new URL(`http${/^(?:localhost|(?:\d{1,3}\.){3}\d{1,3})(?=[:/?#]|$)/i.test(input) ? "" : "s"}://${input}`);
      if (url.hostname) return url.href;
    } catch { /* Search invalid addresses as text. */ }
  }

  const base = SEARCH_ENGINES[engine] || SEARCH_ENGINES.google;
  return base + encodeURIComponent(input);
}
