// Bake the procedural atmosphere once; browsers only composite a small bitmap.
// Run from the repository root: node scripts/bake-reach-mist.mjs
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
<defs>
<filter id="cloud" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency=".008 .012" numOctaves="3" seed="29"/>
<feColorMatrix type="matrix" values="0 0 0 0 .72  0 0 0 0 .73  0 0 0 0 .75  2.4 0 0 0 -.65"/>
<feGaussianBlur stdDeviation="1.2"/>
</filter>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
<stop offset=".3" stop-color="white" stop-opacity="0"/>
<stop offset=".60" stop-color="white" stop-opacity=".4"/>
<stop offset=".86" stop-color="white"/>
</linearGradient>
<mask id="mask"><rect width="1200" height="800" fill="url(#fade)"/></mask>
</defs><g mask="url(#mask)"><rect width="1200" height="800" filter="url(#cloud)"/></g></svg>`;
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage();
  const base64 = await page.evaluate(async (source) => {
    const url = URL.createObjectURL(
      new Blob([source], { type: "image/svg+xml" }),
    );
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 426;
      canvas.getContext("2d").drawImage(image, 0, 0, 640, 426);
      return canvas.toDataURL("image/webp", 0.8).split(",")[1];
    } finally {
      URL.revokeObjectURL(url);
    }
  }, svg);
  await writeFile(
    "public/images/reach-mist.webp",
    Buffer.from(base64, "base64"),
  );
} finally {
  await browser.close();
}
