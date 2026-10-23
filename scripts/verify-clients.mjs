import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3000", {
    waitUntil: "networkidle",
  });
  const section = page.locator("#clients");
  const logos = section.locator(".client-directory-grid img");
  const toggle = section.locator(".client-directory-caption button");
  await expect(logos).toHaveCount(12);
  await section.evaluate((e) =>
    scrollTo(0, e.getBoundingClientRect().top + scrollY - 95),
  );
  await expect(section.locator(".client-directory-grid li").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(logos).toHaveCount(27);
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(
    new Set(await logos.evaluateAll((es) => es.map((e) => e.alt))).size,
  ).toBe(27);
  await logos.evaluateAll(async (es) => {
    for (const e of es) {
      e.loading = "eager";
      await e.decode();
    }
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(logos).toHaveCount(12);
  await expect(toggle).toBeFocused();
  for (const width of [2560, 1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await section.evaluate((e) =>
      scrollTo(0, e.getBoundingClientRect().top + scrollY - 95),
    );
    await page.waitForTimeout(300);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const grid = await section.locator(".client-directory-grid").boundingBox();
    expect(grid.x).toBeGreaterThanOrEqual(width <= 600 ? 22 : 24);
    expect(grid.x + grid.width).toBeLessThanOrEqual(width - 22);
    if (width === 1440 || width === 390)
      await section.screenshot({
        path: `/tmp/vectramind-client-directory-${width}.png`,
      });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await toggle.click();
  await expect(logos).toHaveCount(27);
  await expect(section.locator(".client-directory-grid li").last()).toHaveCSS(
    "opacity",
    "1",
  );
  expect(errors).toEqual([]);
  console.log(
    "Passed: logo reveal, all 27 unique images, keyboard expansion, preserved focus, 320–2560px gutters/overflow and reduced motion.",
  );
} finally {
  await browser.close();
}
