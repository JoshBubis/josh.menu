/**
 * Render the Open Graph share card (1200×630) from og/card.html.
 *
 *   node scripts/render-og.mjs
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
  deviceScaleFactor: 2,
});
await page.goto(html, { waitUntil: "networkidle" });
await page.waitForTimeout(200);
await page.locator(".card").screenshot({
  path: out,
  type: "jpeg",
  quality: 92,
});
await browser.close();
console.log(`Wrote ${out}`);
