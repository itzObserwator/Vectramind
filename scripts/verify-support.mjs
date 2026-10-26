import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-support";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  await page.goto(`${base}/support/`, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toHaveText("Here to help.With you.");
  await page.getByRole("link", { name: "Find an answer", exact: true }).click();
  await expect(page).toHaveURL(/#support-answers$/);
  await expect(page.locator(".faq-list details")).toHaveCount(8);
  await page.getByRole("tab", { name: "Synapse", exact: true }).click();
  await expect(page.locator(".faq-list details")).toHaveCount(3);
  await page.getByRole("searchbox").fill("Maker Checker");
  await expect(page.locator(".faq-list details")).toHaveCount(1);
  await expect(page.locator(".faq-result-count")).toContainText("1 answer");
  await page.locator(".faq-list summary").click();
  await expect(page.locator(".faq-list details")).toHaveAttribute("open", "");
  await expect(page.locator(".faq-list details p")).toHaveCSS("opacity", "1");
  await page.getByRole("searchbox").fill("");
  await page
    .getByRole("tab", { name: "Synapse", exact: true })
    .press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Firstpass", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("patient journey");
  await page.getByRole("tab", { name: "Firstpass", exact: true }).press("End");
  await expect(page.locator(".faq-list details")).toHaveCount(2);
  await page.getByRole("searchbox").fill("no-matching-answer-xyz");
  await expect(page.locator(".empty-results")).toBeVisible();
  await expect(page.locator(".faq-result-count")).toContainText("0 answers");
  await page.getByRole("searchbox").fill("");
  await page.getByRole("tab", { name: "General", exact: true }).press("Home");
  await expect(page.locator(".faq-list details")).toHaveCount(8);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `${output}/support-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("link", { name: "Contact support", exact: true })
    .click();
  await expect(page).toHaveURL(/#support-request$/);
  await expect(page.getByRole("combobox")).toHaveValue("support");
  await page.getByLabel("Your name").fill("Support Test");
  await page.getByLabel("Work email").fill("support-test@example.test");
  await page
    .getByLabel("Organization", { exact: true })
    .fill("Example organization");
  await page.getByRole("combobox").selectOption("synapse");
  await page
    .getByLabel("Your message")
    .fill("Please help us review campaign scheduling for our organization.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.locator(".email-draft")).toContainText("Topic: synapse");
  await expect(
    page.getByRole("link", { name: "Open email app" }),
  ).toHaveAttribute("href", /^mailto:support@vectramind.com\?/);
  await expect(page.locator(".email-draft")).toContainText("has not been sent");
  await page.getByRole("button", { name: "Write another enquiry" }).click();
  await expect(page.getByRole("combobox")).toHaveValue("synapse");

  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Support", exact: true })
    .click();
  await expect(page.locator("#support-title")).toBeVisible();
  await expect(page).toHaveURL(/\/support\/?$/);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(errors).toEqual([]);
  console.log(
    "Passed: FAQ topic tabs, keyboard controls, search/counts/empty results, accessible answers, 320–2560px layouts, support enquiry draft, reduced motion and mobile menu navigation. No browser errors.",
  );
} finally {
  await browser.close();
}
