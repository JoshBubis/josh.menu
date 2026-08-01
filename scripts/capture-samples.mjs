/**
 * Tall full-page captures for josh.menu sample-card scroll previews.
 * Serve the site locally first, e.g. python3 -m http.server 8899
 *
 *   node scripts/capture-samples.mjs
 *   node scripts/capture-samples.mjs http://localhost:8899
 */
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const origin = process.argv[2] || "http://localhost:8899";
const outDir = path.join(__dirname, "..", "images", "samples");
fs.mkdirSync(outDir, { recursive: true });

const samples = [
  { slug: "harbor-lane", path: "/samples/harbor-lane/", ready: ".board-panel" },
  { slug: "northline", path: "/samples/northline/", ready: "h1" },
  { slug: "holloway", path: "/samples/holloway/", ready: "h1" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 800 },
  deviceScaleFactor: 1.25,
});

for (const sample of samples) {
  const page = await context.newPage();
  const url = origin.replace(/\/$/, "") + sample.path;
  console.log(`Capturing ${sample.slug} ← ${url}`);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector(sample.ready, { timeout: 15000 });
    // Hide demo ribbon so the scroll preview reads as the client site.
    await page.addStyleTag({
      content: ".demo-ribbon { display: none !important; }",
    });
    await page.waitForTimeout(600);
    const out = path.join(outDir, `${sample.slug}.jpg`);
    await page.screenshot({ path: out, fullPage: true, type: "jpeg", quality: 72 });
    const stat = fs.statSync(out);
    console.log(`  → ${out} (${Math.round(stat.size / 1024)} KB)`);
  } catch (err) {
    console.error(`  ✗ ${sample.slug}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("Done.");
