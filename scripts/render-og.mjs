/**
 * Render the Open Graph share card (1200×630) from og/card.html.
 * 1× JPEG kept lean for iMessage / Slack (deviceScaleFactor: 1).
 *
 *   npm run render-og
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = pathToFileURL(join(root, "og/card.html")).href;
const out = join(root, "images/og.jpg");

mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto(html, { waitUntil: "networkidle" });
await page.waitForTimeout(150);
await page.locator(".card").screenshot({
  path: out,
  type: "jpeg",
  quality: 78,
});
await browser.close();
console.log(`Wrote ${out}`);
