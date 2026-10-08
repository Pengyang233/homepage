import { test, expect } from "@playwright/test";

test("the info panel presents only a fixed daily Mao Selected Works quote", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  await page.locator(".description").click();
  await expect(page.locator(".daily-quote")).toBeVisible();
  await expect(page.locator(".time-capsule")).toHaveCount(0);
  await expect(page.locator(".daily-quote .eyebrow")).toHaveText("每日一句");
  const quote = await page.locator(".quote-text").innerText();
  expect(quote.length).toBeGreaterThan(5);
  await expect(page.locator(".daily-quote .from")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("#main")).toBeVisible();
  await page.locator(".description").click();
  await expect(page.locator(".quote-text")).toHaveText(quote);
});
