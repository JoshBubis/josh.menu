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
- The mark is `.jm-mark` — bone block, emerald J, ground M. Reuse it; don't invent
  new label motifs.

`joshbubis.com` still exists as a plain résumé site for job applications. It must
never link here, and this site must never link there.

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
- Green means *live*: it belongs on the status strip, the mark, labels, links,
  and focus rings. `--danger` (`#e5544b`) is for form errors only, never
  decoration — otherwise green-as-healthy and green-as-brand contradict.
- **The work sells above the fold.** The hero is a two-column grid: copy left,
  a framed live product screenshot right. Dark ground exists so those bright
  screenshots read as lit frames rather than thumbnails — don't lighten it.
- Motion budget, in full: mask reveals on the wordmark, the section-head
  cascade, a few pixels of parallax on framed work, the process spine inking in,
  and one cursor-follow light in the hero. That is the whole list. Adding to it
  is a decision, not a detail.
- Hairline rules stay structural. Shadows do nothing on this ground — the
  retheme removed them all rather than tinting them.

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
3. `node scripts/verify-live.mjs http://localhost:8899` against a local
   `python3 -m http.server 8899` — covers desktop, mobile, and reduced-motion.
4. Push `main`. CDN/HTML can lag ~10 minutes.
5. Re-run `node scripts/verify-live.mjs` with no argument to check production.
6. Update `docs/README.md` when structure/behavior changes.

## Easy foot-guns

- Work shots are **static JPEGs** (`images/work/`), not live. Refresh with
  `npm install && npm run capture-work`, then commit.
- Do **not** put scroll-reveal opacity on work panels (off-screen rail cards stay invisible).
- Reveal and parallax fight each other: `.reveal.is-in` sets `transform: none`,
  which cancels a parallax offset on the same element. Put the reveal on a
  wrapper and `data-parallax` on the child (see `.hero-frame-wrap`).
- The hero status strip reads live figures from `api.josh.menu/webhooks/status`,
  but the markup ships an honest hardcoded fallback ("4 systems live") and the
  fetch failure is swallowed — a console error here fails `scripts/verify-live.mjs`.
  Never print a figure the endpoint didn't return; Hub sends `null` for missing
  data, and Hub deliberately reports a count rather than which product is down.
- At ≤720px the header stacks into two rows, so `--header-offset` and the hero's
  top padding are both overridden in that breakpoint. Change them together.
- Nav jumps: `scroll-padding-top` only — never also `scroll-margin-top` on sections.
- The chat widget is beta-gated (`BETA_GATE` in `chat.js`, `localStorage.jm_chat_beta`).
  Don't flip it in the same change as anything else.
- Turnstile widgets are domain-scoped: this site's sitekey comes from Hub at
  runtime via `api.josh.menu/webhooks/contact/site_config`. Don't hardcode one.

Hub details: `/Users/jbair/Projects/hub/AGENTS.md`, `docs/portfolio-contact.md`, `docs/studio.md`.
