/**
 * Contrast / a11y audit for josh.menu (+ optional Hub public URLs).
 * Injects local axe-core (CSP blocks CDN on production).
 *
 *   npm run audit-a11y
 *   npm run audit-a11y -- http://127.0.0.1:8899
 *   npm run audit-a11y -- https://josh.menu
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const origin = (process.argv[2] || "https://josh.menu").replace(/\/$/, "");

const pages = [
  "/",
  "/contact.html",
  "/samples/",
  "/samples/harbor-lane/",
  "/samples/northline/",
  "/samples/holloway/",
];

// Public Hub / Studio surfaces that don't need login (skip /up health JSON)
const extra = [
  "https://contracts.josh.menu/",
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  colorScheme: "dark",
});

let serious = 0;
const findings = [];

async function audit(url, label) {
  const page = await context.newPage();
  console.log(`\n→ ${label || url}`);
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (!res || res.status() >= 400) {
      console.log(`  skip (HTTP ${res?.status() ?? "err"})`);
      return;
    }
    await page.waitForTimeout(800);
    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      return await axe.run(document, {
        runOnly: ["wcag2a", "wcag2aa", "wcag21aa"],
        resultTypes: ["violations"],
      });
    });

    const viols = results.violations || [];
    if (!viols.length) {
      console.log("  ok — no axe violations");
      return;
    }

    for (const v of viols) {
      const nodes = (v.nodes || []).slice(0, 5).map((n) => n.target?.join(" ") || n.html?.slice(0, 80));
      findings.push({ url, id: v.id, impact: v.impact, help: v.help, nodes });
      if (v.impact === "serious" || v.impact === "critical") serious += 1;
      console.log(`  ${v.impact?.toUpperCase() || "?"}  ${v.id} — ${v.help}`);
      nodes.forEach((n) => console.log(`         ${n}`));
    }
  } catch (err) {
    console.log(`  error: ${err.message}`);
  } finally {
    await page.close();
  }
}

for (const path of pages) {
  await audit(origin + path, path);
}

if (origin.includes("josh.menu") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
  for (const url of extra) {
    await audit(url);
  }
}

await browser.close();

console.log("\n—— Summary ——");
console.log(`${findings.length} violation group(s); ${serious} serious/critical`);
if (serious > 0) process.exit(1);
