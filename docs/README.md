# josh.menu

Static GitHub Pages sales site for the **Josh.Menu** studio.

**Hub hybrid:** public marketing lives here; Studio, contracts, contact verify,
and Vault live in `/Users/jbair/Projects/hub`. See root [`AGENTS.md`](../AGENTS.md)
and Hub [`AGENTS.md`](/Users/jbair/Projects/hub/AGENTS.md) § Sibling projects.

**Brand:** surname-free by design. This site is the studio; `joshbubis.com` is a
separate résumé site for job applications. Neither links to the other, and the
work rail carries **Visit** links only — the old **Source** links pointed at
`github.com/JoshBubis` and put the surname back in the page. See `AGENTS.md`.

### Structure

- `index.html` — hero (two-column: copy left, framed product screenshot right; clean ground, maker's line, status strip), work rail, **Systems** (capabilities) and a **Samples** strip (Travel / Contractor / Law fictional demos — separate from Live work), approach, process, about, CTA
- `samples/harbor-lane/` — fictional cruise-advisor demo (Galveston specialty); also in `/Users/jbair/Projects/clients/harborlanetravel.com`
- `samples/northline/` — fictional GC demo (Unsplash stock, not Urban Contracting); also in `/Users/jbair/Projects/clients/northlinecontracting.com`
- Homepage `#samples` — three demo cards (Travel, Contractor, Law), kept off the work rail
- `samples/holloway/` — fictional law / professional-services demo; also in `/Users/jbair/Projects/clients/hollowaylaw.com`
- `contact.html` + `contact.js` — form UI → Hub `/webhooks/contact` on `api.josh.menu`
- `chat.js` — concierge chat widget → Hub `/webhooks/chat` (polling). Public (`BETA_GATE = false`). `[data-open-chat]` anywhere opens the panel (used by Systems CTA)
- `style.css` / `studio.css` — keep `studio.css` a copy of `style.css`. Design tokens are the `:root` block at the top; the visual direction they encode is documented in [`AGENTS.md`](../AGENTS.md) § Design language
- `script.js` — reveals (hero + section-head cascades), work-rail scroll/dots/drag, hero cursor light, parallax on `[data-parallax]`. Motion extras (2026-07-29): nav/footer sliding underlines, approach/process stagger delays, process-num scale on reveal, button press scale — all under `prefers-reduced-motion`
- `scripts/verify-live.mjs` — pre-flight sweep (desktop/mobile/reduced-motion; surname, overflow, JS errors). Pass a local origin to run it before pushing; the `api.josh.menu` assertions are skipped off the live origin
- `images/work/*.jpg` — manual Playwright captures (`npm run capture-work`)
- `AGENTS.md` — agent routing + shipping rules
- `scripts/rebrand.py` — one-shot record of the 2026-07-29 joshbubis.com → josh.menu
  conversion. Safe to delete once the site settles.

Work-rail panels use flat "plate" labels (JM maker's mark + domain) instead of
browser chrome; screenshots stay clickable through `.work-shot-link`. The
`.jm-mark` chip (bone block, emerald J, ground M — the favicon in type) is the
brand mark; reuse it rather than inventing new label motifs.

### Backend endpoints

Both public endpoints live on `api.josh.menu`, which is the same Hub app behind the
same Cloudflare Tunnel — it exists so this site never names `hub.joshbubis.com` in
its page source. Hub 404s everything on that hostname except `/webhooks/*`.

| Endpoint | Purpose |
|---|---|
| `GET /webhooks/contact/site_config` | Turnstile sitekey for this origin (widgets are domain-scoped) |
| `POST /webhooks/contact` | Contact form → email + Lead record |
| `POST /webhooks/chat` | Concierge chat turns |

**Not built yet:** the hero's live status strip wants `GET /webhooks/status`
returning `uptime_30d` and `latency_p95_ms` across the four products, with
`Access-Control-Allow-Origin: https://josh.menu`. Until Hub serves it, the strip
stays static text — a fetch to a missing endpoint logs a console error and fails
`scripts/verify-live.mjs`. Wiring instructions are in `script.js`.

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
