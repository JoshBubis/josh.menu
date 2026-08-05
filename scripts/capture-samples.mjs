/**
 * Tall full-page captures for josh.menu sample-card scroll previews.
 * Serve the site locally first, e.g. python3 -m http.server 8899
 *
 *   node scripts/capture-samples.mjs
 *   node scripts/capture-samples.mjs http://localhost:8899
 *
 * Scrolls the full page so lazy-loaded images actually paint before capture.
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
  { slug: "marlowe", path: "/samples/marlowe/", ready: "h1" },
  { slug: "ridgewood", path: "/samples/ridgewood/", ready: "h1" },
  { slug: "elena-voss", path: "/samples/elena-voss/", ready: "h1" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 800 },
  deviceScaleFactor: 1.25,
});

/** Walk the page so loading="lazy" images enter the viewport and decode. */
async function warmImages(page) {
  // Force eager decode where the browser still respects loading attrs mid-session.
  await page.evaluate(() => {
    document.querySelectorAll("img[loading='lazy']").forEach((img) => {
      img.loading = "eager";
      if (img.dataset.src && !img.src) img.src = img.dataset.src;
    });
  });

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 600;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);

  // Wait until every <img> has finished (or failed) decoding.
  await page.waitForFunction(
    () =>
      [...document.images].every(
        (img) => img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0 || !img.src)
      ),
    { timeout: 20000 }
  ).catch(() => {
    /* continue with whatever painted — better than hanging forever */
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

for (const sample of samples) {
  const page = await context.newPage();
  const url = origin.replace(/\/$/, "") + sample.path;
  console.log(`Capturing ${sample.slug} ← ${url}`);
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(sample.ready, { timeout: 15000 });
    // Hide demo ribbon so the scroll preview reads as the client site.
    await page.addStyleTag({
      content: ".demo-ribbon { display: none !important; }",
    });
    await warmImages(page);
    const out = path.join(outDir, `${sample.slug}.jpg`);
    await page.screenshot({ path: out, fullPage: true, type: "jpeg", quality: 74 });
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
