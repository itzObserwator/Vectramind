import { chromium, expect } from "@playwright/test";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  const partners = page.locator(".client-partners");
  const rows = page.locator(".client-logo-row");
  const belts = page.locator(".client-logo-belt");
  const originals = page.locator(".client-logo-list:not([aria-hidden]) img");
  await expect(partners).toHaveAttribute("data-reveal-phase", "waiting");
  await expect(partners).toHaveAttribute("data-paused", "true");
  await partners.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(partners).toHaveAttribute("data-reveal-phase", "revealing");
  const beforeReveal = await offsets();
  await page.waitForTimeout(250);
  await expect(partners).toHaveAttribute("data-paused", "true");
  expect(await offsets()).toEqual(beforeReveal);
  await expect(originals.first()).toHaveCSS("opacity", "0");
  expect(
    await rows
      .nth(1)
      .evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      ),
  ).toBeLessThan(-1);
  await page.screenshot({ path: "/tmp/vectramind-client-circle-reveal.png" });
  await expect(partners).toHaveAttribute("data-reveal-phase", "complete");
  await expect(originals.first()).toHaveCSS("opacity", "1");
  await expect(partners).toHaveAttribute("data-paused", "false");
  await expect(originals).toHaveCount(27);
  const names = await originals.evaluateAll((imgs) =>
    imgs.map((img) => img.alt),
  );
  expect(new Set(names).size).toBe(27);
  await originals.evaluateAll(async (imgs) => {
    for (const img of imgs) {
      img.loading = "eager";
      await img.decode();
    }
  });
  expect(
    await page
      .locator('.client-logo-list[aria-hidden="true"] img')
      .evaluateAll((imgs) => imgs.every((img) => !img.alt)),
  ).toBe(true);
  async function offsets() {
    return belts.evaluateAll((els) =>
      els.map(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
      ),
    );
  }
  const start = await offsets();
  await page.waitForTimeout(900);
  const moved = await offsets();
  expect(moved[0]).toBeLessThan(start[0] - 5);
  expect(moved[1]).toBeGreaterThan(start[1] + 5);
  await page.getByRole("button", { name: "Pause logos", exact: true }).click();
  await expect(partners).toHaveAttribute("data-paused", "true");
  await expect(belts.first()).toHaveCSS("animation-play-state", "paused");
  await page.waitForTimeout(100);
  const frozen = await offsets();
  await page.waitForTimeout(300);
  expect(await offsets()).toEqual(frozen);

  // At a loop boundary the first duplicate must replace the original at the
  // same position, without a visible gap or jump.
  const seam = await belts.first().evaluate((belt) => {
    const animation = belt.getAnimations()[0];
    const duration = Number(animation.effect.getTiming().duration);
    animation.currentTime = 0;
    const first = belt.children[0].children[0].getBoundingClientRect().x;
    animation.currentTime = duration - 1;
    const next = belt.children[1].children[0].getBoundingClientRect().x;
    return Math.abs(first - next);
  });
  expect(seam).toBeLessThan(1);
  await page.getByRole("button", { name: "Play logos", exact: true }).click();
  await expect(partners).toHaveAttribute("data-paused", "false");

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await partners.scrollIntoViewIfNeeded();
    const circle = page.locator(".client-logo-badge").first();
    const bounds = await circle.boundingBox();
    expect(Math.abs(bounds.width - bounds.height)).toBeLessThan(1);
    await expect(circle).toHaveCSS("border-radius", "50%");
    await expect(originals.first()).toHaveCSS("filter", "none");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await partners.screenshot({
      path: `/tmp/vectramind-client-circles-${width}.png`,
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(partners).toHaveAttribute("data-paused", "true");
  await partners.scrollIntoViewIfNeeded();
  await expect(partners).toHaveAttribute("data-reveal-phase", "complete");
  await expect(partners).toHaveAttribute("data-paused", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await partners.scrollIntoViewIfNeeded();
  for (const belt of await belts.all())
    await expect(belt).toHaveCSS("animation-name", "none");
  await expect(
    page.getByRole("button", { name: "Pause logos", exact: true }),
  ).not.toBeVisible();
  await rows.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => rows.first().evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await expect(originals).toHaveCount(27);
  await page.reload({ waitUntil: "networkidle" });
  await expect(partners).toHaveAttribute("data-reveal-phase", "complete");
  await expect(originals.first()).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
  console.log(
    "Passed: circle unfold before logo reveal and horizontal motion, no replay on reentry, 27 logos, seamless loops, pause/resume, desktop/mobile badges, reduced-motion bypass, and keyboard scrolling.",
  );
} finally {
  await browser.close();
}
