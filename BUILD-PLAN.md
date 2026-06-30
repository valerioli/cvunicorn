# CVUnicorn — Build Plan

**Slogan:** "How can you still send a CV to an AI unicorn — in the AI era?"
**Audience:** AI-related job seekers (global, **excluding Mainland China & the EU** during beta — avoids PIPL/GDPR cross-border complexity).
**Pricing:** $0.99 / 1-week site · $9.99 / 1-year site. Card **and** stablecoin via Infini.
**Promise:** Upload a CV → get a hosted personal site in ~60s. We host it on a real domain (the pain point: nobody can show a recruiter `localhost`).

---

## What's in this folder

- **`index.html`** — the working MVP front-end. It's a real, clickable product demo:
  - Hero + slogan, "How it works", pricing.
  - A functioning **builder**: paste/upload a CV → "Generate" → it parses your roles, skills and links and renders a **live portfolio preview** you can edit line-by-line.
  - **Plan selection** ($0.99 / $9.99) → **Infini checkout** (card + stablecoin tabs) → success screen with the published URL.
  - "Open ↗" actually renders the generated site in a new tab.

### Real vs. mocked in the demo
| Piece | Demo | Production |
|---|---|---|
| CV parsing | Client-side heuristic (works on pasted text) | Server-side **LLM** parse of PDF/DOCX → structured JSON, role-tailoring |
| Portfolio render | Live in an iframe | Same templating, rendered to a static page |
| Payment | Mock modal | **Infini hosted payment link / checkout** (card + USDC/USDT) |
| Publish/host | Simulated URL | Deploy static site to a subdomain (or custom domain) |
| Auth / manage / delete | — | Magic-link login + dashboard + 1-click delete |

---

## Production architecture (lean)

```
Browser (upload + live preview)
        │
        ▼
API (Node/Workers)
  ├─ Parse: LLM extracts {name, headline, about, experience[], skills[], links[]} from PDF/DOCX
  │         + optional "tailor to this job description" pass
  ├─ Render: template engine → static HTML/CSS (no JS needed)
  ├─ Payments: create Infini payment link → webhook flips status = paid
  └─ Deploy: push static site to host under a subdomain; set TTL (7d / 365d)
        │
        ▼
Storage: object store (CVs, generated sites) + DB (users, sites, plan, expiry)
Edge: Cloudflare (CDN, free SSL, free DDoS/WAF) + wildcard *.cvunicorn.site
```

### Components
1. **Generator service** — the AI step. One LLM call to structure the CV, an optional second call to tailor copy to a target role/JD (this is the differentiator). Cost ≈ $0.10–0.30 per site.
2. **Template renderer** — turns the JSON into a static page (start with the one editorial template; add 2–3 later).
3. **Payments (Infini)** — use **hosted payment links** so we never touch card data (PCI scope = 0). Card + USDC/USDT. Webhook → mark `paid`, then publish. Handle refunds/expiry.
4. **Hosting/deploy** — Cloudflare Pages (or R2 + Worker) behind a wildcard subdomain `*.cvunicorn.site`. Free bandwidth/SSL/DDoS at this scale. Custom-domain option on the $9.99 tier via Cloudflare Registrar at ~$10.5/yr (pass-through).
5. **Lifecycle** — a scheduled job unpublishes sites past their TTL; reminder emails before expiry (opt-in renewal, **no silent auto-charge**).
6. **Dashboard** — magic-link login; edit & re-publish; **one-click delete** of site + source CV (privacy requirement + trust feature).

---

## Unit economics (recap)

| Cost | Amount |
|---|---|
| Hosting + bandwidth + SSL + DDoS (static, Cloudflare) | ~$0 |
| AI generation (per site, one-time) | ~$0.10–0.30 |
| Payment fee (Infini ~0.3%) | $0.003 on $0.99 · $0.03 on $9.99 |
| Custom domain (year tier, optional) | ~$10.5/yr at cost |
| Compliance (GDPR/PIPL) | one-time ~$1–3k legal, amortized → ~$0 at scale |

- **$0.99 weekly** comfortably covers its marginal cost; margin funds the fixed/compliance base.
- **$9.99 yearly** covers a custom domain at cost (~$10.5) only if the user adds one — so keep the custom domain as an *opt-in add-on*, or cap the year tier to subdomain + offer domain at "+ at-cost".
- Both prices are near break-even by design (your stated goal): tiny money, not gouging.

> ⚠️ If a year-tier user takes a custom domain, $9.99 < the ~$10.5 domain cost. Options: (a) make custom domain a paid add-on (+$5), (b) year tier = subdomain only, custom domain billed separately at cost, or (c) raise the year tier to ~$14.99 if it bundles a domain.

---

## MVP scope (build order)

1. **Front-end** (done — `index.html`): upload → generate → preview/edit → plan → checkout flow.
2. **Generator API**: PDF/DOCX → LLM → JSON; render template to static HTML.
3. **Infini payments**: payment link + webhook; gate publish on `paid`.
4. **Deploy pipeline**: wildcard subdomain hosting + TTL expiry job.
5. **Dashboard**: magic-link auth, edit/re-publish, delete.
6. **Fast-follows**: JD-tailoring ("optimize for this job"), 2–3 templates, custom-domain add-on, analytics for the site owner.

## Compliance & guardrails (must-have before launch)
- Geo-gate out Mainland China & EU during beta (Infini also excludes Mainland China).
- Privacy policy + DPA, encryption at rest, minimal retention, **one-click delete**.
- Pay-to-publish deters spam; add light moderation for impersonation / NSFW.
- No silent renewals; clear expiry + reminders.

## Open decisions
- **Brand name** — "CVUnicorn" is a placeholder; easy to swap (alternatives: Unifolio, Hireable, OneCV).
- **Year-tier domain policy** (see the ⚠️ above).
- **Template count at launch** — recommend **one** great template first.
