import { chromium, expect } from "@playwright/test";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  // Visible headline, rather than merely text hidden inside an animation mask.
  const title = page.locator(".experience-title-mask > span").first();
  const mask = page.locator(".experience-title-mask").first();
  expect(
    Math.abs((await title.boundingBox()).y - (await mask.boundingBox()).y),
  ).toBeLessThan(2);
  await expect(page.locator(".experience-hero canvas")).toHaveCount(1);
  await expect(
    page.locator(".experience-hero > .signal-field > .signal-fallback"),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore our platforms" }),
  ).toHaveAttribute("href", "#products");
  const track = page.locator(".experience-capability-track");
  const states = [];
  for (const progress of [0.05, 0.48, 0.92, 0.05]) {
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
    await page.waitForTimeout(1000);
    states.push(
      await page.locator(".experience-capability-copy h3").textContent(),
    );
    expect(
      Math.abs(
        (await page.locator(".experience-capability-sticky").boundingBox()).y,
      ),
    ).toBeLessThan(2);
  }
  expect(new Set(states).size).toBe(3);
  expect(states[0]).toBe(states[3]);
  await page
    .locator(".experience-ecosystem")
    .evaluate((el) =>
      scrollTo(
        0,
        el.getBoundingClientRect().top +
          scrollY +
          (el.offsetHeight - innerHeight) * 0.98,
      ),
    );
  await page.waitForTimeout(2200);
  const node = page.getByRole("button", {
    name: "Patient journeys",
    exact: true,
  });
  await node.click();
  await expect(node).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".ecosystem-detail")).toContainText(
    "From appointment to ongoing care",
  );
  await expect(page.locator(".ecosystem-orbit-path").first()).toHaveCSS(
    "stroke-dashoffset",
    "0px",
  );
  await expect(page.locator(".experience-work-card")).toHaveCount(2);
  await expect(page.locator(".work-synapse")).toHaveAttribute(
    "href",
    /^\/synapse\/?$/,
  );
  await expect(page.locator(".work-firstpass")).toHaveAttribute(
    "href",
    /^\/firstpass\/?$/,
  );
  for (const width of [2560, 1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    await page.waitForTimeout(250);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBe(true);
    for (const node of await page.locator(".ecosystem-node").all()) {
      const bounds = await node.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
  }
  await expect(page.locator(".experience-capability-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await page
    .getByRole("button", { name: "Previous capability", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Next capability", exact: true })
    .click();
  await expect(page.locator(".experience-capability-copy h3")).toHaveText(
    "Bridge the gaps. Move forward together.",
  );
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".experience-capability-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(page.locator(".ecosystem-current")).toHaveCSS(
    "animation-name",
    "none",
  );
  expect(errors).toEqual([]);
  console.log(
    "Passed: visible animated hero, WebGL/fallback handoff, forward/reverse pinned capabilities, ecosystem interaction/reveal, product destinations, 360–2560px widths, reduced motion, light theme, and no browser errors.",
  );
} finally {
  await browser.close();
}
