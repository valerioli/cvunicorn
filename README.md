# CVUnicorn 🦄

AI personal website builder — upload your CV, photos, projects, press, and story; get a designed personal website in minutes.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. Zero runtime SDK dependencies — AI, payments, and storage all speak REST via `fetch`.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have (everything has dev fallbacks)
npm run dev                  # http://localhost:3000
```

With no env vars at all you can still run the full product loop locally: build a draft at `/start`, "pay" through the simulated checkout, and (with `ANTHROPIC_API_KEY` set) generate a real site.

## Deploy to GitHub + Vercel

```bash
git init && git add -A && git commit -m "CVUnicorn v1"
git remote add origin https://github.com/valerioli/cvunicorn.git
git push -u origin main --force   # replaces the old prototype
```

Then on [vercel.com](https://vercel.com): **Add New → Project → import `valerioli/cvunicorn`** (defaults are correct for Next.js) and add the environment variables from `.env.example`:

| Variable | Needed for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | correct links, sitemap, OG | your production URL |
| `ANTHROPIC_API_KEY` | website generation | console.anthropic.com |
| `ACCESS_TOKEN_SECRET` | signing receipt/access links | `openssl rand -base64 32` |
| `UPSTASH_REDIS_REST_URL/TOKEN` | persistent drafts/orders/sites | Vercel → Marketplace → Upstash Redis (free) |
| `BLOB_READ_WRITE_TOKEN` | file uploads | Vercel → Storage → Blob |
| `PAYMENT_PROVIDER` + Infinimoney vars | live payments | see below |

## Payments

All payment logic sits behind one interface: `src/lib/payments/provider.ts`.

- **`dev` provider** (default): a fully working simulated checkout at `/checkout/pay` so the whole flow — pricing → checkout → confirmation → receipt → access control — works end-to-end with no external account.
- **`infini` provider** (`src/lib/payments/infini.ts`): real integration with Infini (business.infini.money). Creates orders via `POST /order` (HTTP-Signature auth: keyId + HMAC-SHA256 over method/path/date/digest), redirects customers to Infini's hosted `checkout_url`, verifies webhooks (HMAC-SHA256 over `timestamp+body`), and — as a safety net — polls `GET /order` for pending orders so payment confirmation works even before webhooks are configured. Setup: create an API key at business.infini.money → Developer, set `INFINI_API_KEY`/`INFINI_SECRET_KEY`/`INFINI_ENV` and `PAYMENT_PROVIDER=infini`, then add a webhook endpoint pointing to `https://YOUR-DOMAIN/api/payments/webhook` subscribed to `order.create` + `order.update`. Test in sandbox first (card 4000 0000 0000 0085). Note: Infini settles in USDC/USDT crypto; confirm the exact webhook payload field names against one real sandbox event in the console's "Webhook 事件" tab — the adapter parses defensively but one look validates it.

Provider branding never appears in CVUnicorn's UI — customers only see it on the provider's own hosted checkout page.

**Flow:** `/pricing` → `/checkout` (plan + email) → `POST /api/checkout` creates an order + provider session → customer pays on hosted page → provider webhook `POST /api/payments/webhook` marks the order paid/failed → `/checkout/success` polls `GET /api/payments/status` → `/account` dashboard (signed-token access) → `POST /api/generate` builds the site → served at `/site/[slug]` with per-request access control; expiry shows a graceful offline page. Receipts at `/receipt/[orderId]` (print → PDF).

## Architecture map

```
src/app                 pages (marketing, wizard, checkout, account, receipt)
src/app/api             checkout, payments (webhook/status/dev), intake, upload, generate
src/app/site/[slug]     serves generated sites (access-controlled)
src/components          design system + wizard components
src/content             plans, professions, FAQs, showcase (single source of truth)
src/lib                 seo/jsonld, intake schema, storage, orders, access tokens
src/lib/payments        provider interface + dev + infinimoney adapters
src/lib/ai/generator.ts Anthropic REST generation pipeline
```

## SEO / AEO

Per-page metadata + canonicals, Schema.org JSON-LD (Organization, WebSite, Product with both offers, FAQPage, HowTo, BreadcrumbList), OG/Twitter cards with generated `og.png`, `sitemap.xml` + `robots.txt` (AI crawlers explicitly welcomed), `llms.txt`, eight indexable `/for/[profession]` landing pages, FAQ copy written as direct answers for answer engines, semantic landmarks, skip-link, static generation for all marketing pages.

## Production TODOs (known, deliberate v1 gaps)

- **Email delivery** (receipts / magic links) — access links currently live on the success page only. Wire up Resend/Postmark in `markOrderPaid`.
- **Infinimoney**: verify the four `TODO(infinimoney)` markers against real docs.
- **Custom domains** for Unicorn Year are a manual fulfillment step for now.
- **CV file text extraction** — the generator uses pasted bio/CV text today; parse uploaded PDF/DOCX server-side when ready.
- `/account` lookup without a link requires emailing support; add magic-link email auth when email delivery exists.
