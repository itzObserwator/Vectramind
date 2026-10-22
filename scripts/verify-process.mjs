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
  const section = page.locator(".process-track");
  const heading = page.locator(".process-heading h2");
  const stage = page.locator(".process-sticky");
  const sphere = page.locator(".process-orb");
  async function scrub(progress) {
    await section.evaluate(
      (el, progress) =>
        window.scrollTo(
          0,
          el.getBoundingClientRect().top +
            scrollY +
            (el.offsetHeight - innerHeight) * progress,
        ),
      progress,
    );
    await page.waitForTimeout(1100);
  }
  const positions = [];
  for (const [progress, title] of [
    [0.05, "Discover"],
    [0.47, "Design"],
    [0.91, "Evolve"],
    [0.05, "Discover"],
  ]) {
    await scrub(progress);
    await expect(heading).toContainText(title);
    expect(Math.abs((await stage.boundingBox()).y)).toBeLessThan(2);
    positions.push({
      sphere: (await sphere.boundingBox()).y,
      caption: (await page.locator(".process-caption").boundingBox()).y,
    });
  }
  expect(positions[0].sphere - positions[2].sphere).toBeGreaterThan(200);
  expect(Math.abs(positions[0].sphere - positions[3].sphere)).toBeLessThan(2);
  expect(
    Math.max(...positions.map((p) => p.caption)) -
      Math.min(...positions.map((p) => p.caption)),
  ).toBeLessThan(2);
  await stage.screenshot({ path: "/tmp/vectramind-process-start.png" });

  await scrub(0.31);
  const window = await page.locator(".process-title-window").boundingBox();
  const first = await page
    .locator(".process-title-reel > span")
    .nth(0)
    .boundingBox();
  const second = await page
    .locator(".process-title-reel > span")
    .nth(1)
    .boundingBox();
  expect(first.y).toBeLessThan(window.y);
  expect(first.y + first.height).toBeGreaterThan(window.y);
  expect(second.y).toBeGreaterThan(window.y);
  expect(second.y).toBeLessThan(window.y + window.height);
  await expect(page.locator(".process-step-label")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  await stage.screenshot({ path: "/tmp/vectramind-process-roll.png" });
  await page.getByRole("button", { name: "03 Evolve", exact: true }).click();
  await expect(heading).toContainText("Evolve");
  await page.waitForTimeout(900);
  await stage.screenshot({ path: "/tmp/vectramind-process-end.png" });

  await page.setViewportSize({ width: 1440, height: 768 });
  await scrub(0.47);
  const caption = await page.locator(".process-caption").boundingBox();
  expect(caption.y).toBeGreaterThan(0);
  expect(caption.y + caption.height).toBeLessThanOrEqual(769);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "02 Design", exact: true }).click();
  await expect(heading).toContainText("Design");
  await page.waitForTimeout(600);
  await expect(stage).toHaveCSS("position", "relative");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await stage.screenshot({ path: "/tmp/vectramind-process-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "03 Evolve", exact: true }).click();
  await expect(heading).toContainText("Evolve");
  await expect(stage).toHaveCSS("position", "relative");
  expect(
    await section.evaluate((el) =>
      Number(el.style.getPropertyValue("--process-step")),
    ),
  ).toBe(2);
  expect(errors).toEqual([]);
  console.log(
    "Passed: masked text/number rolls, rising sphere, fixed caption, reverse scrolling, step buttons, short viewport, mobile, reduced motion, and no browser errors.",
  );
} finally {
  await browser.close();
}
