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
  const track = page.locator(".platform-showcase-track");
  const stage = page.locator(".platform-showcase-sticky");
  const device = page.locator(".macbook-mockup");
  async function scrub(progress) {
    await track.evaluate(
      (el, progress) =>
        window.scrollTo(
          0,
          el.getBoundingClientRect().top +
            scrollY +
            (el.offsetHeight - innerHeight) * progress,
        ),
      progress,
    );
    await page.waitForTimeout(1200);
  }
  const frames = [];
  for (const progress of [0.05, 0.48, 0.95, 0.05]) {
    await scrub(progress);
    expect(Math.abs((await stage.boundingBox()).y)).toBeLessThan(2);
    frames.push(
      await device.evaluate((el) => ({
        scale: new DOMMatrixReadOnly(getComputedStyle(el).transform).m11,
        rotation: new DOMMatrixReadOnly(getComputedStyle(el).transform).m23,
        top: el.getBoundingClientRect().top,
      })),
    );
  }
  expect(frames[2].scale).toBeGreaterThan(frames[0].scale * 1.25);
  expect(Math.abs(frames[2].rotation)).toBeLessThan(0.001);
  expect(Math.abs(frames[2].top - frames[0].top)).toBeLessThan(2);
  await expect(page.locator(".macbook-key")).toHaveCount(77);
  await expect(page.locator(".macbook-trackpad")).toBeVisible();
  await expect(page.locator(".macbook-pedestal")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(Math.abs(frames[0].scale - frames[3].scale)).toBeLessThan(0.005);
  await stage.screenshot({
    path: "/tmp/vectramind-dashboard-scroll-start.png",
  });
  await scrub(0.48);
  await stage.screenshot({
    path: "/tmp/vectramind-dashboard-scroll-middle.png",
  });
  await scrub(0.95);
  await stage.screenshot({ path: "/tmp/vectramind-dashboard-scroll-end.png" });
  for (const height of [1000, 768]) {
    await page.setViewportSize({ width: 1440, height });
    await scrub(0.95);
    const box = await page.locator(".macbook-lid").boundingBox();
    const display = await page.locator(".platform-display").boundingBox();
    const deck = await page.locator(".macbook-deck").boundingBox();
    expect(
      Math.abs(box.y + box.height - (display.y + display.height)),
    ).toBeLessThan(3);
    expect(deck.y).toBeGreaterThan(display.y + display.height - 3);
    const tabs = await page.locator(".platform-tabs").boundingBox();
    const cta = await page.locator(".platform-bottom").boundingBox();
    expect(box.y).toBeGreaterThan(tabs.y + tabs.height);
    expect(box.y + box.height).toBeLessThan(cta.y);
    expect(box.x).toBeGreaterThan(0);
    expect(box.x + box.width).toBeLessThan(1440);
  }
  await page.getByRole("tab", { name: "Firstpass Patient experience" }).click();
  await expect(page.locator(".firstpass-preview")).toBeVisible();
  await page.waitForTimeout(600);
  await page.getByRole("tab", { name: "Synapse Customer engagement" }).click();
  await expect(page.locator(".synapse-preview")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore Synapse", exact: true }),
  ).toHaveAttribute("href", /^\/synapse\/?$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await expect(stage).toHaveCSS("position", "static");
  await expect(device).toHaveCSS("transform", "none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  await expect(stage).toHaveCSS("position", "static");
  await expect(device).toHaveCSS("transform", "none");
  expect(errors).toEqual([]);
  console.log(
    "Passed: MacBook hardware, top-anchored scroll zoom, keyboard exits the stage, reverse scrolling, short viewport, product tabs/CTA, mobile, reduced motion, and no browser errors.",
  );
} finally {
  await browser.close();
}
