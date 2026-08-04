# josh.menu

Static GitHub Pages sales site for the **Josh.Menu** studio.

**Hub hybrid:** public marketing lives here; Studio, contracts, contact verify,
and Vault live in `/Users/jbair/Projects/hub`. See root [`AGENTS.md`](../AGENTS.md)
and Hub [`AGENTS.md`](/Users/jbair/Projects/hub/AGENTS.md) § Sibling projects.

**Brand:** surname-free by design. This site is the studio; `joshbubis.com` is
the personal résumé (it may link here). Work rail carries **Visit** links only —
no **Source** links to `github.com/JoshBubis`. See `AGENTS.md`.

### Structure

- `index.html` — hero (two-column: copy left, cartoon browser lander demo right), then **Samples** first (easy lander get), approach, **Systems**, live **Work** rail lower (depth proof), process, about, CTA. Pitch is broader than “I build websites” without listing every capability.
- `samples/harbor-lane/` — browse-led cruise demo (sailings board + Why Galveston split with caption bar, not a full-bleed photo quote); also in `/Users/jbair/Projects/clients/harborlanetravel.com`
- `samples/northline/` — classic full-bleed GC lander (Unsplash stock, not Urban Contracting); also in `/Users/jbair/Projects/clients/northlinecontracting.com`
- `samples/holloway/` — quiet type-led law/editorial demo; also in `/Users/jbair/Projects/clients/hollowaylaw.com`
- Homepage `#samples` and `/samples/` directory — three deliberately different shapes (browse / classic / editorial), kept off the work rail
- Work rail order: Relayra → Catamist → HackyChat → CalledFrom → josh.finance (`npm run capture-work` refreshes JPEGs; includes josh-finance). The old GPU tracker that once lived on this domain is frozen as `beanspill` (candidate revive host `josh3.com` — Hub `docs/domains.md`); do not put it back on josh.menu
- Root `404.html` — branded Pages 404 (GitHub’s stock page otherwise)
- Security headers (CSP, HSTS, frame deny, nosniff) — set at Cloudflare edge via
  Hub `bin/rails cloudflare:static_security_headers` (Pages cannot set them)
- `contact.html` + `contact.js` — form UI → Hub `/webhooks/contact` on `api.josh.menu`
- `chat.js` — concierge chat widget → Hub `/webhooks/chat` (polling). Public (`BETA_GATE = false`). `[data-open-chat]` anywhere opens the panel (used by Systems CTA)
- `style.css` / `studio.css` — keep `studio.css` a copy of `style.css`. Design tokens are the `:root` block at the top; the visual direction they encode is documented in [`AGENTS.md`](../AGENTS.md) § Design language. No film-grain overlay (read as monitor smudge); atmosphere is cursor light + lander demo.
- `script.js` — reveals (hero + section-head cascades), work-rail scroll/dots/drag (prev/next wrap at ends; drag scrollLeft clamped; `overscroll-behavior-x: contain` so trackpads can’t rubber-band into a blank tail), page-wide cursor light, parallax on `[data-parallax]` (work rail if present). Hero lander demo is CSS-only keyframes in `style.css`. Motion extras: nav/footer sliding underlines, approach/process stagger, process-num scale, button press, white→emerald heading hover — all under `prefers-reduced-motion`
- `scripts/verify-live.mjs` — pre-flight sweep (desktop/mobile/reduced-motion; surname, overflow, JS errors). Pass a local origin to run it before pushing; the `api.josh.menu` assertions are skipped off the live origin
- `scripts/audit-a11y.mjs` (`npm run audit-a11y`) — axe-core contrast/ARIA sweep of the sales pages (+ live `contracts.josh.menu`). Injects local `axe-core` so production CSP does not block the run. Exit 1 on serious/critical.
- `images/work/*.jpg` — manual Playwright captures (`npm run capture-work`)
- `images/samples/*.jpg` — tall full-page captures for sample-card scroll
  previews (`npm run capture-samples` against a local server)
- `AGENTS.md` — agent routing + shipping rules
- `scripts/rebrand.py` — one-shot record of the 2026-07-29 joshbubis.com → josh.menu
  conversion. Safe to delete once the site settles.

Work-rail panels use flat "plate" labels (JM maker's mark + domain) instead of
browser chrome; screenshots stay clickable through `.work-shot-link`. The
`.jm-mark` chip (black field, bone border, emerald J, bone M — quiet, no glow
stack) is the brand mark; reuse it rather than inventing new label motifs.
Share previews use a lean `images/og.jpg` (`npm run render-og` after editing
`og/card.html`). Keep the JPEG ~1200×630 at 1× so iMessage/Slack load fast.
Hero pitch: outcome-first (“look the part / run like you mean it”), landers
before product apps in the scroll. On phones (≤720px): hamburger full-screen
nav, stacked hero CTAs, chat as an icon chip + bottom sheet — not a wrapped
desktop nav.

**Pricing copy caution:** don’t promise blanket “no monthly fees.” Focused
landers are usually one-time + handoff to hosting the client controls
(Cloudflare Pages free tier is the common path). Ongoing care, Josh-hosted
periods, or larger systems may be monthly — only when written into the
agreement. Prefer “not a website-builder subscription” / “optional care if
we agree” over absolute no-fees language.

### SEO (keep honest)

- Homepage title/description/JSON-LD target **landing pages / small-business
  sites / one-time handoff** — not generic “web design agency” spam.
- Visible `#faq` + matching `FAQPage` schema; answers must stay aligned with
  the pricing caution above.
- `sitemap.xml` lists only crawl-worthy URLs (`/` and `/samples/`). Contact is
  `noindex`; individual sample demos are `noindex,follow` so fictional
  businesses don’t rank as real firms. The `/samples/` index stays indexable.
- Surname never appears in public markup (verify-live checks).

### Backend endpoints

Both public endpoints live on `api.josh.menu`, which is the same Hub app behind the
same Cloudflare Tunnel — it exists so this site never names `hub.joshbubis.com` in
its page source. Hub 404s everything on that hostname except `/webhooks/*`.

| Endpoint | Purpose |
|---|---|
| `GET /webhooks/contact/site_config` | Turnstile sitekey for this origin (widgets are domain-scoped) |
| `POST /webhooks/contact` | Contact form → email + Lead record |
| `POST /webhooks/chat` | Concierge chat turns |

Hero live signal is four green dots only (no Hub status/uptime fetch).

### Boundaries

| Concern | Folder |
|---|---|
| This marketing UI | `/Users/jbair/Projects/josh.menu` |
| Contact verify, SES, Vault, Studio | `/Users/jbair/Projects/hub` |
| Résumé site | `/Users/jbair/Projects/joshbubis.com` |
| Product apps | Their own folders |

### Deploy

Push `main` → GitHub Pages. Bump `?v=` on CSS/JS/images when shipping so visitors
are not stuck on stale assets.
