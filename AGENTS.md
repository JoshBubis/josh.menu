# AGENTS.md — josh.menu

Static GitHub Pages **sales site** for the Josh Menu studio.
`/Users/jbair/Projects/josh.menu`.

## The brand rule that matters most

This site is the studio's public face and it is **deliberately surname-free**.
The point of the 2026-07-29 rebrand was to separate the side business from Josh's
employment, so treat these as bugs, not style preferences:

- No "Bubis" anywhere — copy, alt text, aria labels, meta tags, commit-visible files.
- No links to `joshbubis.com`, `linkedin.com/in/joshbubis`, or `github.com/JoshBubis`
  (that last one is why the work rail has **Visit** links but no **Source** links).
- Client mail is `josh@josh.menu`. Never `josh@joshbubis.com`.
- The mark is `.jm-mark` — black field, bone border, emerald J, bone M. Quiet
  chip (no glow stack). Reuse it; don't invent new label motifs. Favicon + OG
  card (`images/og.jpg`) match. Keep OG at 1200×630 / 1× for fast link previews.

`joshbubis.com` is the personal résumé site. It may link here (Josh.Menu in
Selected work). This sales site stays surname-free and does **not** link to the
résumé — clients shouldn’t land on employment branding.

## Design language

Split deliberately, because the previous single-sentence rule ("paper-and-ink,
hairline rules, one red accent, no particle effects, no auto-scroll, no glows")
mixed permanent guardrails with a style choice, and agents defended both equally
— including against Josh.

**Invariants — do not trade these away for a look:**

- Honour `prefers-reduced-motion` on every animation, without exception.
- Never take scroll or focus from the reader: no auto-advancing carousels, no
  hijacked wheel, no scroll-jacked sections.
- Motion carries meaning or mood. If it only fills space, cut it.
- No particle fields, no glow blobs, no gradient-mesh backdrops. These read as
  generated, which is the one thing a studio site cannot afford.
- Contrast passes AA. Never set body copy in the accent colour.
- 60fps floor; animate transform and opacity, not layout.
- The anonymity rules above are not style rules and are never in scope.

**Visual direction v2 — July 2026. Current decision, not law; ask before
overriding, and update this block if it changes.**

- **Signal Emerald on a tinted ground.** Ground `#080b0a` (a green-cast black,
  not neutral — the accent has to look native to the surface), surface `#0f1412`,
  bone type `#edebe6`, accent `#10d592`. Tokens live at the top of `style.css`.
- Green means *live*: it belongs on the hero’s green dots, the mark, labels,
  links, focus rings, and white→emerald hover on headings. `--danger`
  (`#e5544b`) is for form errors only, never decoration — otherwise
  green-as-healthy and green-as-brand contradict.
- **The hero sells the craft above the fold.** Two-column grid: copy left, a
  cartoon browser lander demo right (scroll + click loop). **Sample landers
  come next** (the cheap/easy get); live product shots stay on the work rail
  **lower on the page** as depth proof — don't lead with Catamist/etc. unless
  Josh asks. Dark ground keeps the demo reading as a lit frame.
- **Pricing copy:** never promise blanket “no monthly fees.” Landers are
  usually one-time + handoff to hosting the client controls (often Cloudflare
  Pages). Care plans, Josh-hosted periods, or bigger systems may be monthly —
  only when contracted. Prefer “not a website-builder subscription.”
- Motion budget, in full: mask reveals on the wordmark, the section-head
  cascade, the hero lander scroll/cursor/click loop (CSS keyframes, paused
  under `prefers-reduced-motion`), sample-card tallshot scroll previews
  (pause on hover / reduced-motion), the process spine inking in, a page-wide
  cursor-follow light, and white→emerald text hover on headings/labels. That
  is the whole list. Adding to it is a decision, not a detail.
- No full-width hairline “page breaks” between sections — separate with
  spacing; eyebrows already carry a short accent tick. Keep borders on real
  UI chrome (nav scroll state, demo browser chrome, chat panel, form fields).
  Shadows do nothing on this ground — the retheme removed them all rather
  than tinting them.
- **The hero ground is clean.** The v1 paper direction's ruled baselines and
  emerald margin rule were retired (late July 2026) because they read as
  looseleaf paper on the dark ground. Grain, the cursor light, and the lander
  demo carry atmosphere — don't reintroduce backdrop patterns without asking.

## Hybrid with Hub (keep this in mind)

This repo is HTML/CSS/JS only. Hub owns Studio, contracts, chat replies, Turnstile
verification, Vault, and Access. Cursor often has Hub open as the workspace — still
edit **this** folder for sales-site UI. Do not merge the two repos unless Josh asks.

| Host | Owns it |
|---|---|
| `josh.menu` | **This repo** (Pages) |
| `api.josh.menu` | Hub — contact form + chat endpoints |
| `contracts.josh.menu` / `studio.josh.menu` | Hub |
| `hub.joshbubis.com` | Hub itself (stays put: passkeys are origin-bound) |
| `joshbubis.com` | Separate résumé repo |

| Change | Folder |
|---|---|
| HTML/CSS/JS, work rail, screenshots, contact form UI | this repo |
| Turnstile secret, SES, Vault, Studio/Client Work | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

## Shipping (user-visible)

1. Bump `?v=` on `style.css` / `script.js` (and images if JPEGs changed).
2. `cp style.css studio.css` when styles change.
3. Keep root `404.html` self-contained (inline CSS) — Pages serves it for missing paths. Keep `samples/index.html` so `/samples/` is not a 404.
4. `node scripts/verify-live.mjs http://localhost:8899` against a local
   `python3 -m http.server 8899` — covers desktop, mobile, and reduced-motion.
5. `npm run audit-a11y -- http://localhost:8899` for contrast/ARIA (axe). Against
   production: `npm run audit-a11y` (also hits `contracts.josh.menu`).
6. After mark / OG card edits: `npm run render-og` (writes `images/og.jpg`).
7. Push `main`. CDN/HTML can lag ~10 minutes. Link-preview caches (iMessage,
   Slack, Facebook) can lag longer — bump `images/og.jpg?v=` when the card changes.
8. Re-run `node scripts/verify-live.mjs` with no argument to check production.
9. Update `docs/README.md` when structure/behavior changes.

## Easy foot-guns

- Work shots are **static JPEGs** (`images/work/`), not live. Refresh with
  `npm install && npm run capture-work`, then commit.
- Do **not** put scroll-reveal opacity on work panels (off-screen rail cards stay invisible).
- Reveal and parallax fight each other: `.reveal.is-in` sets `transform: none`,
  which cancels a parallax offset on the same element. Put the reveal on a
  wrapper and `data-parallax` on the child if you reintroduce parallax.
- The hero live signal is four green dots only (no uptime copy, no Hub fetch).
  Don’t reintroduce status stats unless Josh asks.
- At ≤720px the header is a single row + hamburger (full-screen nav sheet). Keep
  `--header-offset` in sync with that bar height if you change header padding.
- Nav jumps: `scroll-padding-top` only — never also `scroll-margin-top` on sections.
- The chat widget is beta-gated (`BETA_GATE` in `chat.js`, `localStorage.jm_chat_beta`).
  Don't flip it in the same change as anything else.
- Turnstile widgets are domain-scoped: this site's sitekey comes from Hub at
  runtime via `api.josh.menu/webhooks/contact/site_config`. Don't hardcode one.

Hub details: `/Users/jbair/Projects/hub/AGENTS.md`, `docs/portfolio-contact.md`, `docs/studio.md`.
