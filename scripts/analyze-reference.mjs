import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("/tmp/vectramind-reference", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.goto("https://www.medusmo.com/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(10000);
await page.screenshot({ path: "/tmp/vectramind-reference/hero.png" });
await writeFile(
  "/tmp/vectramind-reference/structure.json",
  JSON.stringify(
    await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      headings: [...document.querySelectorAll("h1,h2,h3")]
        .filter((e) => e.getBoundingClientRect().height)
        .map((e) => ({
          text: e.textContent,
          font: getComputedStyle(e).fontFamily,
          size: getComputedStyle(e).fontSize,
        })),
    })),
    null,
    2,
  ),
);
for (const [name, y] of [
  ["intro", 1200],
  ["solutions", 2500],
  ["platform", 5000],
  ["process", 7000],
  ["partners", 9500],
  ["clients", 12500],
  ["numbers", 15000],
  ["footer", 22000],
]) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `/tmp/vectramind-reference/${name}.png` });
}
await browser.close();
console.log("Reference screenshots saved to /tmp/vectramind-reference");
