import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "networkidle" });
  const section = page.locator(".post-hero-intro");
  await expect(section.locator("canvas")).toHaveCount(0);
  await expect(section.locator("h2")).toContainText("Are disconnected");
  await expect(
    page.locator(".post-hero-logo-list:not([aria-hidden]) img"),
  ).toHaveCount(6);
  // Approaching the section must not consume the entrance below the fold.
  const graphic = page.locator(".post-hero-graphic");
  await graphic.evaluate((el) =>
    scrollTo(
      0,
      el.getBoundingClientRect().top +
        scrollY +
        el.clientHeight / 2 -
        innerHeight * 0.9,
    ),
  );
  await page.waitForTimeout(400);
  await expect(graphic).not.toHaveAttribute("data-animation-phase", "complete");
  await expect(page.locator(".post-hero-outcome")).toHaveCSS("opacity", "0");
  // Cross the entry threshold and stop: the reference continues by itself.
  await graphic.evaluate((el) =>
    scrollTo(
      0,
      el.getBoundingClientRect().top +
        scrollY +
        el.clientHeight / 2 -
        innerHeight * 0.77,
    ),
  );
  await page.waitForTimeout(150);
  await expect(graphic).toHaveAttribute("data-animation-phase", "playing");
  const stoppedAt = await page.evaluate(() => scrollY);
  const marker = page.locator(".post-hero-node-right");
  const earlyY = (await marker.boundingBox()).y;
  const risingColumn = page.locator(".post-hero-column-right");
  const earlyHeight = (await risingColumn.boundingBox()).height;
  const earlyBottom = await risingColumn.evaluate(
    (el) => el.getBoundingClientRect().bottom,
  );
  await page.waitForTimeout(350);
  const patientOpacity = await page
    .locator(".post-hero-card-patient")
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  const messageOpacity = await page
    .locator(".post-hero-card-message")
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(patientOpacity).toBeGreaterThan(messageOpacity);
  await expect(graphic).toHaveAttribute("data-animation-phase", "complete", {
    timeout: 7000,
  });
  const lateY = (await marker.boundingBox()).y;
  expect((await risingColumn.boundingBox()).height).toBeGreaterThan(
    earlyHeight + 30,
  );
  expect(
    Math.abs(
      (await risingColumn.evaluate((el) => el.getBoundingClientRect().bottom)) -
        earlyBottom,
    ),
  ).toBeLessThan(1);
  expect(lateY).toBeLessThan(earlyY - 30);
  expect(
    Math.abs((await page.evaluate(() => scrollY)) - stoppedAt),
  ).toBeLessThan(2);
  await expect(page.locator(".post-hero-card-message")).toBeVisible();
  await expect(page.locator(".post-hero-card-patient")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Published hospital case ↗" }),
  ).toHaveAttribute("href", /^\/synapse\/?$/);
  const tens = await page
    .locator(".post-hero-tens-reel")
    .evaluate(
      (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
    );
  expect(tens).toBeLessThan(-20);
  for (const [selector, index] of [
    [".post-hero-tens-reel", 1],
    [".post-hero-ones-reel", 10],
  ]) {
    const reel = page.locator(selector);
    const digit = await reel.locator(":scope > span").nth(index).boundingBox();
    const mask = await reel.locator("..").boundingBox();
    expect(
      Math.abs(digit.y - mask.y),
      "Final result digit must sit inside its mask",
    ).toBeLessThan(1);
  }

  const strip = page.locator(".post-hero-client-strip");
  await strip.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 110),
  );
  await page.waitForTimeout(500);
  const belt = page.locator(".post-hero-logo-belt");
  const x = (await belt.boundingBox()).x;
  await page.waitForTimeout(450);
  expect(Math.abs((await belt.boundingBox()).x - x)).toBeGreaterThan(3);
  await page
    .getByRole("button", { name: "Pause client strip", exact: true })
    .click();
  await expect(belt).toHaveCSS("animation-play-state", "paused");
  await page
    .getByRole("button", { name: "Play client strip", exact: true })
    .click();
  await expect(belt).toHaveCSS("animation-play-state", "running");
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(200);
  await expect(graphic).toHaveAttribute("data-animation-phase", "complete");
  await section.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 100),
  );
  await page.waitForTimeout(800);
  const line = await page
    .locator(".post-hero-question-line")
    .first()
    .boundingBox();
  const mask = await page
    .locator(".post-hero-question-mask")
    .first()
    .boundingBox();
  expect(Math.abs(line.y - mask.y)).toBeLessThan(2);
  await page.screenshot({ path: "/tmp/vectramind-post-hero-desktop.png" });
  await page.getByRole("button", { name: "Let’s connect the dots" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  for (const width of [2560, 1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    await page.waitForTimeout(250);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBe(true);
    const art = await page.locator(".post-hero-graphic").boundingBox();
    expect(art.x).toBeGreaterThanOrEqual(0);
    expect(art.x + art.width).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await section.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 80),
  );
  await page.waitForTimeout(700);
  await page.screenshot({ path: "/tmp/vectramind-post-hero-mobile.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(250);
  await expect(belt).toHaveCSS("animation-name", "none");
  await expect(page.locator(".post-hero-progress-fill")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".post-hero-question-line").first()).toHaveCSS(
    "transform",
    "none",
  );
  await expect(graphic).toHaveAttribute("data-animation-phase", "static");
  expect(errors).toEqual([]);
  console.log(
    "Passed: 2D-only post-hero graphic, six client logos, moving/pausable belt, timed sequence while scrolling is stopped, rising marker, rolling case result, no replay on reentry, CTA, 320–2560px layout, reduced motion, and no browser errors.",
  );
} finally {
  await browser.close();
}
