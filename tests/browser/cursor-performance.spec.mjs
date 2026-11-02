import { test, expect } from "@playwright/test";

test("mouse cursor is browser-rendered without a DOM tracking layer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  await page.mouse.move(200, 200);
  await page.mouse.move(450, 350);
  await expect(page.locator("#cursor")).toHaveCount(0);
  expect(await page.locator("html").evaluate((el) => el.classList.contains("custom-cursor-enabled"))).toBe(false);

  const backgroundCursor = await page.locator("body").evaluate((el) => getComputedStyle(el).cursor);
  expect(backgroundCursor).toContain("cursor-default.svg");
  const interactiveCursor = await page.locator(".links-grid a").first().evaluate((el) => getComputedStyle(el).cursor);
  expect(interactiveCursor).toContain("cursor-interactive.svg");
  await expect(page.getByRole("textbox", { name: "搜索网页或输入网址" })).toHaveCSS("cursor", "text");
});

test("reduced motion uses the native system cursor", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  const cursor = await page.locator("body").evaluate((el) => getComputedStyle(el).cursor);
  expect(cursor).not.toContain("cursor-default.svg");
});

test("wallpaper entrance avoids an animated full-screen blur filter", async ({ page }) => {
  await page.goto("/");
  const image = page.locator(".cover .bg");
  await expect(image).toBeVisible();
  await expect(image).toHaveCSS("filter", "none");
  await expect(page.locator("#main")).toHaveCSS("transform", "none");
  const animation = await image.evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).not.toContain("fade-blur-in");
});

test("both cursor SVG assets have a bright face and contrasting outline", async ({ request }) => {
  for (const [path, minimumOpacity] of [
    ["/images/cursor-default.svg", 0.8],
    ["/images/cursor-interactive.svg", 0.9],
  ]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const svg = await response.text();
    expect(svg).toContain('fill="#fff"');
    expect(svg).toContain('stroke="#fff"');
    expect(svg).toContain('stroke="#111827"');
    expect(svg).toContain('viewBox="0 0 32 32"');
    const fillOpacity = Number(svg.match(/fill-opacity="([0-9.]+)"/)?.[1]);
    expect(fillOpacity).toBeGreaterThanOrEqual(minimumOpacity);
  }
});
