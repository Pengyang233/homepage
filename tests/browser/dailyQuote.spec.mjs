import { test, expect } from "@playwright/test";

test("the original quotation card shows the daily quote without opening a panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  const card = page.locator(".message .description");
  const quote = card.locator(".daily-quote .quote-text");
  await expect(card).toBeVisible();
  await expect(quote).toBeVisible();
  const value = (await quote.innerText()).trim();
  expect(value.length).toBeGreaterThan(5);
  await expect(card.locator(".xicon")).toHaveCount(2);
  await expect(card.locator(".eyebrow, .from")).toHaveCount(0);
  await expect(page.locator(".box, .time-capsule")).toHaveCount(0);

  await card.click();
  await expect(page.locator(".function")).toBeVisible();
  await expect(page.locator(".box")).toHaveCount(0);
  await expect(quote).toHaveText(value);

  await page.reload();
  await expect(page.locator("#main")).toBeVisible();
  await expect(page.locator(".message .description .quote-text")).toHaveText(value);
});

test("daily quote remains within its card at narrow and wide viewports", async ({ page }) => {
  for (const width of [320, 390, 720, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible();
    const card = page.locator(".message .description");
    const quote = card.locator(".quote-text");
    await expect(quote).toBeVisible();
    const outer = await card.boundingBox();
    const inner = await quote.boundingBox();
    expect(inner.x).toBeGreaterThanOrEqual(outer.x - 1);
    expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width + 1);
    expect(inner.y).toBeGreaterThanOrEqual(outer.y - 1);
    expect(inner.y + inner.height).toBeLessThanOrEqual(outer.y + outer.height + 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }
});
