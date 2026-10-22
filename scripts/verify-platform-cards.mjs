import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3000", {
    waitUntil: "networkidle",
  });
  const section = page.locator("#products");
  const images = section.locator(".platform-image-link");
  const tags = section.locator(".platform-category");
  const inset = (index) =>
    images
      .nth(index)
      .evaluate((el) =>
        parseFloat(getComputedStyle(el).clipPath.match(/[\d.]+/)[0]),
      );
  const opacity = (locator) =>
    locator.evaluate((el) => +getComputedStyle(el).opacity);
  async function scrub(progress) {
    await section.evaluate(
      (el, p) =>
        scrollTo(
          0,
          el.getBoundingClientRect().top +
            scrollY +
            (el.offsetHeight - innerHeight) * p,
        ),
      progress,
    );
    await page.waitForTimeout(1100);
  }
  expect(await section.evaluate((el) => el.previousElementSibling.id)).toBe(
    "ecosystem",
  );
  await expect(section.locator(".platform-card")).toHaveCount(2);
  await scrub(0.18);
  const early = await inset(0);
  expect(early).toBeGreaterThan(0);
  expect(
    await inset(1),
    "Left preview leads the right preview",
  ).toBeGreaterThan(early);
  expect(await opacity(tags.first())).toBe(0);
  await scrub(0.46);
  expect(await inset(0)).toBe(0);
  expect(await inset(1)).toBe(0);
  expect(await opacity(tags.first())).toBeGreaterThan(0.8);
  expect(
    await opacity(section.locator("h3").first()),
    "Copy follows the image and tags",
  ).toBe(0);
  await scrub(0.94);
  for (const tag of await tags.all())
    await expect(tag).toHaveCSS("opacity", "1");
  for (const title of await section.locator("h3").all())
    await expect(title).toHaveCSS("opacity", "1");
  await expect(section.locator(".work-synapse")).toHaveAttribute(
    "href",
    /^\/synapse\/?$/,
  );
  await expect(section.locator(".work-firstpass")).toHaveAttribute(
    "href",
    /^\/firstpass\/?$/,
  );
  await expect(
    section.getByRole("link", { name: "Explore Synapse", exact: true }),
  ).toHaveCount(2);
  const previews = await images.all();
  const a = await previews[0].boundingBox(),
    b = await previews[1].boundingBox();
  expect(a.y).toBeCloseTo(b.y, 1);
  expect(b.x).toBeGreaterThan(a.x + a.width + 25);
  await section.locator(".platform-card-cta").first().focus();
  await page.screenshot({ path: "/tmp/vectramind-platform-cards-desktop.png" });
  await scrub(0.18);
  expect(await inset(0), "Reverse scrolling restores the reveal").toBeCloseTo(
    early,
    1,
  );
  for (const width of [2560, 1440, 1024, 900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 901 ? 844 : 1000 });
    await page.waitForTimeout(250);
    if (width > 900) await scrub(0.94);
    else {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1300);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow at ${width}`,
    ).toBe(true);
    for (const image of await images.all()) {
      const r = await image.boundingBox();
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.x + r.width).toBeLessThanOrEqual(width);
    }
    if (width === 390)
      await page.screenshot({
        path: "/tmp/vectramind-platform-cards-mobile.png",
      });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator(".platforms-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  for (const image of await images.all())
    await expect(image).toHaveCSS("clip-path", "none");
  expect(errors).toEqual([]);
  console.log(
    "Passed: immediate ecosystem → platforms order, sliver-to-preview reveal, staggered tags and copy, reverse scroll, product destinations, 320–2560px layouts, reduced motion, no browser errors.",
  );
} finally {
  await browser.close();
}
