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
  const animation = await image.evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).not.toContain("fade-blur-in");
});
