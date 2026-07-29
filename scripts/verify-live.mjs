// Pre-flight sweep against the live site. Checks the things that actually broke
// during the domain cutover: leftover surname in the markup, endpoints still
// pointing at the old host, rail nav, mobile overflow, and JS errors.
//
//   node scripts/verify-live.mjs [origin]

import { chromium, devices } from "playwright";

const ORIGIN = process.argv[2] || "https://josh.menu";
const FORBIDDEN = [/bubis/i, /hub\.josh\.menu/i];

let failures = 0;
const check = (ok, label, detail = "") => {
    console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? ` — ${detail}` : ""}`);
    if (!ok) failures++;
};

const browser = await chromium.launch();

for (const [profile, opts] of [
    ["desktop", { viewport: { width: 1280, height: 900 } }],
    ["mobile", devices["iPhone 13"]],
    ["reduced-motion", { viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" }],
]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
        if (m.type() !== "error") return;
        // Turnstile's own script logs styled console noise; only our code counts.
        if ((m.location().url || "").includes("challenges.cloudflare.com")) return;
        errors.push(m.text());
    });

    for (const path of ["/", "/contact.html"]) {
        console.log(`\n[${profile}] ${ORIGIN}${path}`);
        const res = await page.goto(ORIGIN + path, { waitUntil: "domcontentloaded" });
        check(res.status() === 200, "loads 200", `got ${res.status()}`);
        await page.waitForTimeout(1500);

        const html = await page.content();
        for (const re of FORBIDDEN) {
            check(!re.test(html), `no ${re} in markup`);
        }

        // Horizontal overflow is the classic mobile regression on this layout.
        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth
        );
        check(overflow <= 1, "no sideways scroll", `${overflow}px over`);

        check(errors.length === 0, "zero JS errors", errors.join(" | "));
        errors.length = 0;
    }

    // Work rail only exists on the home page.
    if (profile === "desktop") {
        await page.goto(ORIGIN + "/", { waitUntil: "domcontentloaded" });
        const rail = await page.locator("[data-rail], .rail, nav a").count();
        check(rail > 0, "rail nav present", `${rail} nav targets`);

        const form = await page.goto(ORIGIN + "/contact.html", { waitUntil: "domcontentloaded" });
        check(form.status() === 200, "contact page loads");
        const action = await page.locator("form").first().getAttribute("action");
        check(
            /api\.josh\.menu/.test(action || ""),
            "form posts to api.josh.menu",
            action || "(no action)"
        );
        // Turnstile deliberately refuses to auto-pass a headless browser, so we
        // can only assert the widget was configured and asked to render — that it
        // actually solves and unlocks the button is a real-browser check.
        const cfg = await page.evaluate(() =>
            fetch("https://api.josh.menu/webhooks/contact/site_config").then((r) => r.json())
        );
        check(cfg.configured === true, "site_config reports a configured widget");
        check(cfg.mode === "managed", "widget is in managed mode", cfg.mode);
        check(
            (cfg.sitekey || "").startsWith("0x"),
            "site_config returns a josh.menu sitekey"
        );
    }

    await ctx.close();
}

await browser.close();
console.log(`\n${failures === 0 ? "PASS" : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
