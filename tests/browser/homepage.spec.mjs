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
  const blog = page.getByRole("link", { name: "Blog" });
  await expect(blog).toHaveAttribute("href", "https://blog.hyperrin.com/");
  await expect(blog).toHaveAttribute("rel", /noopener/);
});

test("bookmarks render in the requested order across two four-item rows", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const links = page.locator(".links-grid a");
  await expect(links).toHaveCount(8);
  expect(await page.locator(".links-grid .link-name").allTextContents()).toEqual([
    "Blog", "Quant", "Jarvis", "Nexus", "ChatGPT", "Gemini", "Cloudflare", "Bilibili"
  ]);
  const layout = await links.evaluateAll(items => items.map(item => ({
    y: Math.round(item.getBoundingClientRect().top),
    icon: item.querySelector("svg.mono-icon")?.getAttribute("viewBox"),
  })));
  expect(layout.every(item => item.icon === "0 0 24 24")).toBe(true);
  expect(layout.slice(0, 4).every(item => item.y === layout[0].y)).toBe(true);
  expect(layout.slice(4).every(item => item.y === layout[4].y)).toBe(true);
  expect(layout[4].y).toBeGreaterThan(layout[0].y);
});

test("wallpaper remains fixed despite legacy browser settings", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("data", JSON.stringify({ coverType: "2", siteStartShow: true, footerBlur: false }));
  });
  await page.route(/(?:api\.vvhan\.com|v1\.hitokoto\.cn)/, route => route.abort());
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".cover .bg")).toHaveAttribute("src", "/images/background1.jpg");
  await expect(page.locator("footer#footer")).toHaveCount(0);
});

test("the public page does not expose global settings", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  await expect(page.getByRole("button", { name: "打开设置" })).toHaveCount(0);
  await expect(page.locator(".set")).toHaveCount(0);
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

test("published bookmarks ignore old local edits", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("perrin-bookmarks-v1", JSON.stringify([
      { name: "Example", link: "https://example.com/", icon: "link" },
    ]));
  });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "管理常用网址" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Example" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "https://blog.hyperrin.com/");
  await page.reload();
  await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
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
  // 旧 text-hidden 会裁剪 Pacifico 字形的下伸部分。
  const nameContainer = page.locator(".message .name");
  await expect(nameContainer).not.toHaveClass(/text-hidden/);
  const nameStyle = await nameContainer.evaluate(el => ({
    overflow: getComputedStyle(el).overflow,
    paddingBottom: parseFloat(getComputedStyle(el).paddingBottom),
  }));
  expect(nameStyle.overflow).toBe("visible");
  expect(nameStyle.paddingBottom).toBeGreaterThanOrEqual(12);

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

test("large screens use readable weights and recognizable monochrome site icons", async ({ page }) => {
  for (const width of [1280, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible();
    const styles = await page.evaluate(() => {
      const time = document.querySelector(".function .time");
      const title = document.querySelector(".links-header h2");
      const label = document.querySelector(".links-grid .link-name");
      const signature = document.querySelector(".message .name");
      const brandIcon = [...document.querySelectorAll(".links-grid a")]
        .find(link => link.textContent.trim() === "ChatGPT")?.querySelector(".mono-icon");
      return {
        clockWeight: Number(getComputedStyle(time).fontWeight),
        titleWeight: Number(getComputedStyle(title).fontWeight),
        labelWeight: Number(getComputedStyle(label).fontWeight),
        labelSize: parseFloat(getComputedStyle(label).fontSize),
        signatureFont: getComputedStyle(signature).fontFamily,
        brandFill: brandIcon?.getAttribute("fill"),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    expect(styles.clockWeight).toBeGreaterThanOrEqual(500);
    expect(styles.titleWeight).toBeGreaterThanOrEqual(600);
    expect(styles.labelWeight).toBeGreaterThanOrEqual(600);
    expect(styles.labelSize).toBeGreaterThanOrEqual(14);
    expect(styles.signatureFont).toContain("Pacifico-Regular");
    expect(styles.brandFill).toBe("currentColor");
    expect(styles.overflow).toBe(false);
  }
});

test("B2.2 clock keeps balanced hierarchy and fits small to large screens", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("perrin-weather-location-v1", JSON.stringify({
      latitude: 30.27, longitude: 120.15, label: "杭州"
    }));
  });
  await page.route("https://api.open-meteo.com/**", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ current: { temperature_2m: 22, weather_code: 2, is_day: 1 } })
  }));

  for (const width of [320, 390, 720, 721, 1280, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#main")).toBeVisible({ timeout: 10_000 });
    if (width <= 720) await page.locator(".menu").click();
    await expect(page.locator(".function .time")).toBeVisible();
    await expect(page.locator(".clock-caption")).toHaveCount(0);
    await expect(page.locator(".weather-trigger")).toContainText("22°");

    const metrics = await page.evaluate(() => {
      const box = selector => {
        const { x, y, width, height, right, bottom } = document.querySelector(selector).getBoundingClientRect();
        return { x, y, width, height, right, bottom };
      };
      const style = selector => getComputedStyle(document.querySelector(selector));
      const clock = box(".function .time");
      const date = box(".function .date");
      const temperature = box(".weather-trigger .temperature");
      const card = box(".function");
      const weather = box(".weather-panel");
      const clockPanel = box(".clock-panel");
      return {
        clock, date, temperature, card, weather, clockPanel,
        clockSize: parseFloat(style(".function .time").fontSize),
        dateSize: parseFloat(style(".function .date").fontSize),
        tempSize: parseFloat(style(".weather-trigger .temperature").fontSize),
        clockWeight: Number(style(".function .time").fontWeight),
        dateWeight: Number(style(".function .date").fontWeight),
        tempWeight: Number(style(".weather-trigger .temperature").fontWeight),
        weatherGlass: style(".weather-panel").backgroundImage.includes("radial-gradient"),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    expect(metrics.clockSize).toBeGreaterThan(metrics.tempSize);
    expect(metrics.tempSize).toBeGreaterThan(metrics.dateSize);
    expect(metrics.clockWeight).toBeGreaterThanOrEqual(600);
    expect(metrics.tempWeight).toBeGreaterThanOrEqual(600);
    expect(metrics.dateWeight).toBeGreaterThanOrEqual(500);
    expect(metrics.weatherGlass).toBe(true);
    expect(metrics.card.height).toBeGreaterThanOrEqual(139);
    // 两行文字在左侧区域共用中心线，组合也应垂直居中。
    const centerX = rect => rect.x + rect.width / 2;
    const panelCenterX = centerX(metrics.clockPanel);
    const panelCenterY = metrics.clockPanel.y + metrics.clockPanel.height / 2;
    const groupCenterY = (metrics.clock.y + metrics.date.bottom) / 2;
    expect(Math.abs(centerX(metrics.clock) - panelCenterX)).toBeLessThan(2);
    expect(Math.abs(centerX(metrics.date) - panelCenterX)).toBeLessThan(2);
    expect(Math.abs(groupCenterY - panelCenterY)).toBeLessThan(3);
    expect(metrics.clock.x).toBeGreaterThanOrEqual(metrics.card.x);
    expect(metrics.clock.right).toBeLessThanOrEqual(metrics.weather.x + 1);
    expect(metrics.date.right).toBeLessThanOrEqual(metrics.weather.x + 1);
    expect(metrics.weather.right).toBeLessThanOrEqual(metrics.card.right + 1);
    expect(metrics.overflow).toBe(false);
  }
});

test("B2.2 weather city picker remains usable without being clipped", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  await page.locator(".menu").click();
  await page.locator(".weather-trigger").click();
  const picker = page.locator(".city-picker");
  await expect(picker).toBeVisible();
  const box = await picker.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(321);
  await expect(page.getByRole("textbox", { name: "天气城市（不会自动获取位置）" })).toBeVisible();
});

test("search bar has integrated focus styling, accessible engine picker and a balanced arrow icon", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const search = page.getByRole("textbox", { name: "搜索网页或输入网址" });
  await search.click();
  await search.fill("flow matching");
  expect(await search.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("none");
  await expect(page.locator(".quick-search")).toHaveCSS("border-color", "rgba(255, 255, 255, 0.4)");

  const icon = page.locator(".submit-button .mono-icon");
  await expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
  expect(await icon.evaluate(el => Number.parseFloat(getComputedStyle(el).strokeWidth))).toBeGreaterThanOrEqual(2.7);

  const trigger = page.getByRole("button", { name: "搜索引擎" });
  await trigger.click();
  const menu = page.getByRole("listbox", { name: "选择搜索引擎" });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("option", { name: "Google" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("option", { name: "DuckDuckGo" }).click();
  await expect(menu).toHaveCount(0);
  await expect(trigger).toContainText("DuckDuckGo");
  await expect(search).toHaveValue("flow matching");
  await page.reload();
  await expect(page.getByRole("button", { name: "搜索引擎" })).toContainText("DuckDuckGo");

  await page.getByRole("button", { name: "搜索引擎" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox", { name: "选择搜索引擎" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox", { name: "选择搜索引擎" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "搜索引擎" })).toBeFocused();
});

test("search engine menu fits narrow screens and dismisses on outside click", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 760 });
    await page.goto("/");
    await page.locator(".menu").click();
    const trigger = page.getByRole("button", { name: "搜索引擎" });
    await trigger.click();
    const menu = page.getByRole("listbox", { name: "选择搜索引擎" });
    await expect(menu).toBeVisible();
    const rect = await menu.boundingBox();
    expect(rect.x).toBeGreaterThanOrEqual(-1);
    expect(rect.x + rect.width).toBeLessThanOrEqual(width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.getByRole("textbox", { name: "搜索网页或输入网址" }).click();
    await expect(menu).toHaveCount(0);
  }
});
