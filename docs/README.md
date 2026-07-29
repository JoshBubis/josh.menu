# josh.menu

Static GitHub Pages sales site for the **Josh Menu** studio.

**Hub hybrid:** public marketing lives here; Studio, contracts, contact verify,
and Vault live in `/Users/jbair/Projects/hub`. See root [`AGENTS.md`](../AGENTS.md)
and Hub [`AGENTS.md`](/Users/jbair/Projects/hub/AGENTS.md) § Sibling projects.

**Brand:** surname-free by design. This site is the studio; `joshbubis.com` is a
separate résumé site for job applications. Neither links to the other, and the
work rail carries **Visit** links only — the old **Source** links pointed at
`github.com/JoshBubis` and put the surname back in the page. See `AGENTS.md`.

### Structure

- `index.html` — hero (print-registration treatment: ruled grid, red margin rule, crosshairs, maker's line — no canvas; brand letters lift on hover), work rail (native scroll-snap; arrows/dots/keyboard/drag are user-initiated, no auto-drift), approach, process (5-step "how it goes down" timeline; red spine inks in on scroll via #process-rail-fill), about, CTA
- `contact.html` + `contact.js` — form UI → Hub `/webhooks/contact` on `api.josh.menu`
- `chat.js` — concierge chat widget → Hub `/webhooks/chat` (polling, no websockets). **Beta-gated:** renders only when `localStorage.jm_chat_beta === "1"`; flip `BETA_GATE` to false in `chat.js` to open it to everyone
- `style.css` / `studio.css` — keep `studio.css` a copy of `style.css`
- `script.js` — reveals (hero + section-head cascades), work-rail scroll/dots/drag
- `images/work/*.jpg` — manual Playwright captures (`npm run capture-work`)
- `AGENTS.md` — agent routing + shipping rules
- `scripts/rebrand.py` — one-shot record of the 2026-07-29 joshbubis.com → josh.menu
  conversion. Safe to delete once the site settles.

Work-rail panels use flat "plate" labels (JM maker's mark + domain) instead of
browser chrome; screenshots stay clickable through `.work-shot-link`. The
`.jm-mark` chip (ink block, red J, paper M — the favicon in type) is the brand
mark; reuse it rather than inventing new label motifs.

### Backend endpoints

Both public endpoints live on `api.josh.menu`, which is the same Hub app behind the
same Cloudflare Tunnel — it exists so this site never names `hub.joshbubis.com` in
its page source. Hub 404s everything on that hostname except `/webhooks/*`.

| Endpoint | Purpose |
|---|---|
| `GET /webhooks/contact/site_config` | Turnstile sitekey for this origin (widgets are domain-scoped) |
| `POST /webhooks/contact` | Contact form → email + Lead record |
| `POST /webhooks/chat` | Concierge chat turns |

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
