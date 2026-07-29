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
- The mark is `.jm-mark` — ink block, red J, paper M. Reuse it; don't invent new
  label motifs.

`joshbubis.com` still exists as a plain résumé site for job applications. It must
never link here, and this site must never link there.

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
3. Push `main`. CDN/HTML can lag ~10 minutes.
4. Update `docs/README.md` when structure/behavior changes.

## Easy foot-guns

- Work shots are **static JPEGs** (`images/work/`), not live. Refresh with
  `npm install && npm run capture-work`, then commit.
- Do **not** put scroll-reveal opacity on work panels (off-screen rail cards stay invisible).
- Nav jumps: `scroll-padding-top` only — never also `scroll-margin-top` on sections.
- The chat widget is beta-gated (`BETA_GATE` in `chat.js`, `localStorage.jm_chat_beta`).
  Don't flip it in the same change as anything else.
- Turnstile widgets are domain-scoped: this site's sitekey comes from Hub at
  runtime via `api.josh.menu/webhooks/contact/site_config`. Don't hardcode one.

Hub details: `/Users/jbair/Projects/hub/AGENTS.md`, `docs/portfolio-contact.md`, `docs/studio.md`.
