import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const url = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  const track = page.locator(".reference-capabilities");
  const art = track.locator(".experience-capability-art");
  const first = track.locator(".capability-visual-stage-0");
  const second = track.locator(".capability-visual-stage-1");
  const third = track.locator(".capability-visual-stage-2");
  const fin = first.locator('[data-geometry="fin"][data-index="12"]');
  const visiblePanel = first.locator('[data-panel-index="12"]');
  const signal = first.locator(".capability-signal").first();
  await art.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-flow", "running");
  await expect(first).toHaveCSS("opacity", "1");
  await expect(visiblePanel).toHaveCSS("opacity", "1");
  const panelBefore = await visiblePanel.boundingBox();
  const path = await fin.getAttribute("d");
  const light = await signal.evaluate(
    (el) => getComputedStyle(el).strokeDashoffset,
  );
  const scroll = await page.evaluate(() => scrollY);
  await page.waitForTimeout(500);
  expect(
    await fin.getAttribute("d"),
    "Mobile panels move without scrolling",
  ).not.toBe(path);
  expect(
    await signal.evaluate((el) => getComputedStyle(el).strokeDashoffset),
  ).not.toBe(light);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  expect((await visiblePanel.boundingBox()).x).toBeGreaterThan(
    panelBefore.x + 1,
  );

  // Continuous motion must stop outside the artwork, then resume on return.
  await page.evaluate(() => scrollTo(0, 0));
  await expect(first).toHaveAttribute("data-flow", "paused");
  const offscreen = await fin.getAttribute("d");
  await page.waitForTimeout(400);
  expect(await fin.getAttribute("d")).toBe(offscreen);
  await art.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-flow", "running");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(first).toHaveAttribute("data-flow", "paused");
  const hidden = await fin.getAttribute("d");
  await page.waitForTimeout(300);
  expect(await fin.getAttribute("d")).toBe(hidden);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(first).toHaveAttribute("data-flow", "running");

  const next = track.getByRole("button", {
    name: "Next capability",
    exact: true,
  });
  await next.click();
  await expect(track.locator("h3")).toHaveText(
    "Human experiences, thoughtfully connected.",
  );
  await art.scrollIntoViewIfNeeded();
  await expect(second).toHaveAttribute("data-flow", "running");
  await expect(first).toHaveAttribute("data-flow", "paused");
  const shelf = second.locator('[data-geometry="plate"]').first();
  const earlyShelf = await shelf.getAttribute("d");
  await page.waitForTimeout(700);
  expect(
    await shelf.getAttribute("d"),
    "Mobile layer-building sequence advances",
  ).not.toBe(earlyShelf);

  await next.click();
  await expect(track.locator("h3")).toHaveText(
    "Bridge the gaps. Move forward together.",
  );
  await art.scrollIntoViewIfNeeded();
  await expect(third).toHaveAttribute("data-flow", "running");
  await expect(second).toHaveAttribute("data-flow", "paused");
  const route = third.locator('[data-connection="0"] .integration-route');
  await expect
    .poll(
      () =>
        route.evaluate((el) =>
          parseFloat(getComputedStyle(el).strokeDashoffset),
        ),
      { timeout: 7000 },
    )
    .toBeLessThan(0.01);
  await expect
    .poll(
      () =>
        third.locator(".integration-chip-body").evaluateAll((nodes) =>
          nodes.every((el) => {
            const matrix = el.transform.baseVal.consolidate()?.matrix;
            return !matrix || (matrix.a > 0.99 && matrix.d > 0.99);
          }),
        ),
      { timeout: 7000 },
    )
    .toBe(true);

  // Live reduced-motion changes restore a static, button-usable composition.
  await track
    .getByRole("button", { name: "Previous capability", exact: true })
    .click();
  await track
    .getByRole("button", { name: "Previous capability", exact: true })
    .click();
  await art.scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(400);
  const still = await fin.getAttribute("d");
  await page.waitForTimeout(500);
  expect(await fin.getAttribute("d")).toBe(still);
  await next.click();
  await expect(track.locator("h3")).toHaveText(
    "Human experiences, thoughtfully connected.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await art.scrollIntoViewIfNeeded();
  await expect(second).toHaveAttribute("data-flow", "running");

  for (const width of [900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await art.scrollIntoViewIfNeeded();
    await expect(second).toHaveAttribute("data-flow", "running");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
  console.log(
    "Passed: moving mobile fins and lights, animated layer building, sequential integration connections, inactive/offscreen/hidden pause, live reduced motion, working chapter controls and 320–900px layouts.",
  );
} finally {
  await browser.close();
}
