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

test("perrin identity remains prominent and desktop columns align", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator(".message .logo-img")).toHaveAttribute("src", "/images/icon/perrin-logo.png");
  await expect(page.locator(".message .logo .bg")).toHaveText("perrin");
  await expect(page.getByRole("search")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "个人链接与联系方式" })).toBeVisible();
  const left = await page.locator(".all > .left").boundingBox();
  const right = await page.locator(".all > .right").boundingBox();
  expect(Math.abs(left.y - right.y)).toBeLessThan(5);
  expect(Math.abs(left.y + left.height - right.y - right.height)).toBeLessThan(5);
  const brand = await page.locator(".left .message").boundingBox();
  const clock = await page.locator(".right .function").boundingBox();
  const contact = await page.locator(".left .social").boundingBox();
  const bookmarks = await page.locator(".right .links").boundingBox();
  expect(Math.abs(brand.y - clock.y)).toBeLessThan(5);
  expect(Math.abs(contact.y + contact.height - bookmarks.y - bookmarks.height)).toBeLessThan(5);
});

test("bookmark editor saves locally and survives reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "管理常用网址" }).click();
  await page.getByRole("textbox", { name: "网址名称" }).fill("Example");
  await page.getByRole("textbox", { name: "网址地址" }).fill("https://example.com");
  await page.getByRole("button", { name: "添加", exact: true }).click();
  await page.getByRole("button", { name: "保存更改" }).click();
  await expect(page.getByRole("link", { name: "Example" })).toHaveAttribute("href", "https://example.com/");
  await page.reload();
  await expect(page.getByRole("link", { name: "Example" })).toBeVisible();
});

test("weather asks for city and renders a mocked forecast", async ({ page }) => {
  await page.route("https://geocoding-api.open-meteo.com/**", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ results: [{ id: 12, name: "杭州", country: "中国", latitude: 30.27, longitude: 120.15 }] })
  }));
  await page.route("https://api.open-meteo.com/**", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ current: { temperature_2m: 22, weather_code: 0, is_day: 1 } })
  }));
  await page.goto("/");
  await page.getByRole("button", { name: "设置天气城市" }).click();
  await page.getByRole("textbox", { name: "天气城市（不会自动获取位置）" }).fill("杭州");
  await page.getByRole("button", { name: "查找" }).click();
  await page.getByRole("button", { name: /杭州.*中国/ }).click();
  await expect(page.locator(".weather-trigger")).toContainText("22°");
  await expect(page.locator(".weather-trigger")).toContainText("杭州");
});

test("avatar and original handwritten perrin wordmark stack vertically", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  const avatar = page.locator(".message .logo-img");
  const name = page.locator(".message .name .bg");
  const signature = page.locator(".message .description");
  const contact = page.locator(".left .social");
  await expect(avatar).toBeVisible();
  await expect(name).toHaveText("perrin");
  const imageBox = await avatar.boundingBox();
  const nameBox = await name.boundingBox();
  const signatureBox = await signature.boundingBox();
  const contactBox = await contact.boundingBox();
  expect(imageBox.width).toBeGreaterThanOrEqual(150);
  expect(nameBox.y).toBeGreaterThan(imageBox.y + imageBox.height - 1);
  expect(signatureBox.y).toBeGreaterThan(nameBox.y + nameBox.height - 1);
  expect(contactBox.y).toBeGreaterThan(signatureBox.y + signatureBox.height - 1);
  expect(await name.evaluate(el => getComputedStyle(el.parentElement).fontFamily)).toContain("Pacifico-Regular");

  // 不仅上下排列，还要围绕左栏中心线对齐。
  const leftBox = await page.locator(".all > .left").boundingBox();
  const centerX = box => box.x + box.width / 2;
  const leftCenter = centerX(leftBox);
  for (const box of [imageBox, nameBox, signatureBox, contactBox]) {
    expect(Math.abs(centerX(box) - leftCenter)).toBeLessThan(3);
  }
});

test("stacked identity remains accessible on narrow screens", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 760 });
    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible();
    const avatar = await page.locator(".message .logo-img").boundingBox();
    const name = await page.locator(".message .name .bg").boundingBox();
    const signature = await page.locator(".message .description").boundingBox();
    expect(name.y).toBeGreaterThan(avatar.y + avatar.height - 1);
    expect(signature.y).toBeGreaterThan(name.y + name.height - 1);
    expect(avatar.x).toBeGreaterThanOrEqual(0);
    expect(avatar.x + avatar.width).toBeLessThanOrEqual(width);
    const left = await page.locator(".all > .left").boundingBox();
    const centerX = box => box.x + box.width / 2;
    for (const box of [avatar, name, signature]) {
      expect(Math.abs(centerX(box) - centerX(left))).toBeLessThan(3);
    }
  }
});
