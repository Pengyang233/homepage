import { test, expect } from "@playwright/test";

test("small viewports have no horizontal overflow", async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible({ timeout: 10_000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }
});

test("navigation uses accessible links", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  const blog = page.getByRole("link", { name: /博客/ });
  await expect(blog).toHaveAttribute("href", "https://blog.hyperrin.com/");
  await expect(blog).toHaveAttribute("rel", /noopener/);
});

test("failed external wallpaper and quote requests do not block homepage", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("data", JSON.stringify({ coverType: "2", siteStartShow: false, footerBlur: true }));
  });
  await page.route(/(?:api\.vvhan\.com|v1\.hitokoto\.cn)/, route => route.abort());
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible({ timeout: 10_000 });
});

test("settings can be closed by Escape", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  await page.locator(".description").click();
  await expect(page.locator(".box")).toBeVisible();
  await page.getByRole("button", { name: "打开设置" }).click();
  await expect(page.locator(".set")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".set")).toBeHidden();
});
