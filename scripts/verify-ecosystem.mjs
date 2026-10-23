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
  const track = page.locator("#ecosystem");
  const nodes = track.locator(".ecosystem-node");
  const opacity = (selector) =>
    track.locator(selector).evaluate((el) => +getComputedStyle(el).opacity);
  async function scrub(progress) {
    await track.evaluate(
      (el, p) =>
        scrollTo(
          0,
          el.getBoundingClientRect().top +
            scrollY +
            (el.offsetHeight - innerHeight) * p,
        ),
      progress,
    );
    await page.waitForTimeout(1200);
  }
  await expect(nodes).toHaveCount(12);
  await expect(track.locator("canvas")).toHaveCount(0);
  await scrub(0.12);
  expect(await opacity(".ecosystem-hub")).toBeGreaterThan(0.8);
  expect(await opacity('[data-ecosystem-node="0"]')).toBeLessThan(0.05);
  await scrub(0.14);
  expect(
    await opacity('[data-node-base="1"]'),
    "Pedestal resolves before its sphere",
  ).toBeGreaterThan(0.8);
  expect(await opacity('[data-ecosystem-node="1"]')).toBeLessThan(0.05);
  await scrub(0.2);
  expect(
    await opacity('[data-ecosystem-node="1"]'),
    "Upper-right sphere appears first",
  ).toBeGreaterThan(0.35);
  expect(await opacity('[data-ecosystem-node="0"]')).toBeLessThan(0.05);
  await scrub(0.44);
  expect(await opacity('[data-ecosystem-node="3"]')).toBeGreaterThan(0.8);
  expect(await opacity('[data-ecosystem-node="8"]')).toBeLessThan(0.05);
  await scrub(0.53);
  expect(
    await opacity('[data-ecosystem-node="11"]'),
    "Left outer nodes lead the right side",
  ).toBeGreaterThan(0.8);
  expect(await opacity('[data-ecosystem-node="6"]')).toBeLessThan(0.05);
  const settled = await track.locator(".ecosystem-diagram").boundingBox();
  await scrub(0.7);
  const stable = await track.locator(".ecosystem-diagram").boundingBox();
  expect(stable.width, "No continued zoom during the ring build").toBeCloseTo(
    settled.width,
    1,
  );
  expect(stable.y, "Scene settles before outer spheres emerge").toBeCloseTo(
    settled.y,
    1,
  );
  await scrub(0.96);
  for (const node of await nodes.all())
    await expect(node).toHaveCSS("opacity", "1");
  await expect(track.locator(".ecosystem-sticky")).toHaveCSS(
    "position",
    "sticky",
  );
  const diagram = await track.locator(".ecosystem-diagram").boundingBox();
  const heading = await track.locator("h2").boundingBox();
  const topNode = await nodes.nth(4).boundingBox();
  expect(topNode.y).toBeGreaterThan(heading.y + heading.height + 25);
  expect(Math.abs(diagram.width / diagram.height - 1000 / 650)).toBeLessThan(
    0.01,
  );
  const alignment = await track.evaluate((el) => {
    const sphere = el
      .querySelector('[data-ecosystem-node="4"] .ecosystem-sphere')
      .getBoundingClientRect();
    const base = el
      .querySelector('[data-node-base="4"]')
      .getBoundingClientRect();
    return Math.abs(sphere.bottom - (base.y + base.height / 2));
  });
  expect(alignment, "Spheres sit on their elliptical bases").toBeLessThan(7);
  const hubAlignment = await track.evaluate((el) => {
    const hub = el.querySelector(".ecosystem-hub").getBoundingClientRect();
    const base = el
      .querySelector(".ecosystem-center-base")
      .getBoundingClientRect();
    return Math.abs(hub.x + hub.width / 2 - base.x - base.width / 2);
  });
  expect(hubAlignment, "Logo centered over its base").toBeLessThan(2);
  expect(await track.locator(".ecosystem-orbit-path").count()).toBe(8);
  expect(await track.locator(".ecosystem-base-trace").count()).toBe(13);
  await expect(track.locator(".ecosystem-heading")).toHaveCSS("opacity", "0");
  const pedestalRatio = await track.evaluate((el) => {
    const base = el
      .querySelector('[data-node-base="4"]')
      .getBoundingClientRect();
    const sphere = el
      .querySelector('[data-ecosystem-node="4"] .ecosystem-sphere')
      .getBoundingClientRect();
    return base.width / sphere.width;
  });
  expect(
    pedestalRatio,
    "Wide shallow pedestal around the smaller sphere",
  ).toBeGreaterThan(1.5);
  // The ring's current moves without scroll, while the spheres remain stationary.
  const before = await nodes.nth(4).boundingBox();
  const current = track.locator(".ecosystem-current").first();
  const light = await current.evaluate(
    (el) => getComputedStyle(el).strokeDashoffset,
  );
  await page.waitForTimeout(300);
  expect(
    await current.evaluate((el) => getComputedStyle(el).strokeDashoffset),
  ).not.toBe(light);
  expect((await nodes.nth(4).boundingBox()).y).toBeCloseTo(before.y, 1);
  await page
    .getByRole("button", { name: /Patient care: Patient journeys/ })
    .click();
  await expect(track.locator(".ecosystem-detail")).toContainText(
    "From appointment to ongoing care",
  );
  const card = await track.locator(".ecosystem-detail").boundingBox();
  const chosen = await nodes.nth(8).boundingBox();
  expect(
    card.y,
    "Detail card is anchored to the selected sphere",
  ).toBeGreaterThan(chosen.y);
  await page.keyboard.press("Escape");
  await expect(track.locator(".ecosystem-detail")).toHaveCount(0);
  await page.screenshot({ path: "/tmp/vectramind-ecosystem-desktop.png" });
  await scrub(0.12);
  expect(await opacity('[data-ecosystem-node="11"]')).toBeLessThan(0.05);
  await scrub(0.96);
  expect(await opacity('[data-ecosystem-node="11"]')).toBeGreaterThan(0.99);

  for (const width of [2560, 1440, 1024, 900, 768, 390, 360, 320]) {
    await page.setViewportSize({ width, height: width < 901 ? 844 : 1000 });
    await page.waitForTimeout(200);
    if (width > 900) await scrub(0.96);
    else {
      await track.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1600);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No page overflow at ${width}`,
    ).toBe(true);
    for (const node of await nodes.all()) {
      const box = await node.boundingBox();
      expect(box.x, `Left node bound at ${width}`).toBeGreaterThanOrEqual(0);
      expect(
        box.x + box.width,
        `Right node bound at ${width}`,
      ).toBeLessThanOrEqual(width);
    }
    if (width === 390) {
      await expect(track.locator(".ecosystem-heading")).toHaveCSS(
        "opacity",
        "1",
      );
    }
    if (width === 390)
      await page.screenshot({ path: "/tmp/vectramind-ecosystem-mobile.png" });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await track.scrollIntoViewIfNeeded();
  await expect(track.locator(".ecosystem-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  for (const node of await nodes.all()) await expect(node).toBeVisible();
  await expect(current).toHaveCSS("animation-name", "none");
  expect(errors).toEqual([]);
  console.log(
    "Passed: pedestal-first reveals, upper-right then left-led outer build, eight traced arcs, settled camera, stationary spheres with circulating light, reverse scroll, local details, 320–2560px layouts, reduced motion, no browser errors.",
  );
} finally {
  await browser.close();
}
