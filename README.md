# CVUnicorn 🦄

AI personal website builder — upload your CV, photos, projects, press, and story; get a designed personal website in minutes.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. Zero runtime SDK dependencies — AI, payments, and storage all speak REST via `fetch`.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have (everything has dev fallbacks)
npm run dev                  # http://localhost:3000
```

With no env vars at all you can still run the full product loop locally: build a draft at `/start`, "pay" through the simulated checkout, and (with `OPENROUTER_API_KEY` or `OPENAI_API_KEY` set) generate a real site.

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
| `OPENROUTER_API_KEY` | website generation, default provider | openrouter.ai |
| `OPENROUTER_GENERATION_MODEL` | optional OpenRouter model override | e.g. `openai/gpt-5.5` |
| `OPENAI_API_KEY` | optional direct OpenAI fallback | platform.openai.com |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | customer support copy | your support mailbox or forwarding alias |
| `ACCESS_TOKEN_SECRET` | signing receipt/access links | `openssl rand -base64 32` |
| `UPSTASH_REDIS_REST_URL/TOKEN` | persistent drafts/orders/sites | Vercel → Marketplace → Upstash Redis (free) |
| `BLOB_READ_WRITE_TOKEN` | file uploads | Vercel → Storage → Blob |
| `PAYMENT_PROVIDER` + Stripe vars | live card payments | see below |

## Payments

All payment logic sits behind one interface: `src/lib/payments/provider.ts`.

- **`dev` provider** (default): a fully working simulated checkout at `/checkout/pay` so the whole flow — pricing → checkout → confirmation → receipt → access control — works end-to-end with no external account.
- **`stripe` provider** (`src/lib/payments/stripe.ts`, recommended): card payments through Stripe Checkout. It creates a Checkout Session, redirects customers to Stripe's hosted checkout page, verifies `Stripe-Signature` on webhooks, stores the Stripe Checkout Session ID for reconciliation, and polls Stripe as a safety net while an order is still pending.
- **`infini` provider** (`src/lib/payments/infini.ts`, optional): crypto payments via Infini hosted checkout. Keep it for USDT/USDC settlement experiments, but Stripe should be the production default for broad card coverage.

### Stripe setup

Set:

```bash
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...     # or sk_test_... while testing
STRIPE_WEBHOOK_SECRET=whsec_...   # live webhook endpoint secret
# Optional if a Stripe test/sandbox webhook endpoint also points to production:
STRIPE_TEST_WEBHOOK_SECRET=whsec_...
```

In Stripe Workbench / Webhooks, create an endpoint for:

```text
https://YOUR-DOMAIN/api/payments/webhook
```

Subscribe it to:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

Stripe live mode and test mode have separate webhook signing secrets. If both
endpoints point at production, set both `STRIPE_WEBHOOK_SECRET` and
`STRIPE_TEST_WEBHOOK_SECRET` so test-mode retries do not fail signature
verification. You can also set `STRIPE_WEBHOOK_SECRETS` to a comma-separated
list of accepted `whsec_...` values.

Use `sk_test_...` plus card `4242 4242 4242 4242` for a full test checkout before switching to live keys.

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
src/lib/payments        provider interface + dev + Stripe + Infini adapters
src/lib/ai/generator.ts OpenRouter/OpenAI REST generation pipeline, with optional Anthropic fallback
```

## SEO / AEO

Per-page metadata + canonicals, Schema.org JSON-LD (Organization, WebSite, Product with both offers, FAQPage, HowTo, BreadcrumbList), OG/Twitter cards with generated `og.png`, `sitemap.xml` + `robots.txt` (AI crawlers explicitly welcomed), `llms.txt`, eight indexable `/for/[profession]` landing pages, FAQ copy written as direct answers for answer engines, semantic landmarks, skip-link, static generation for all marketing pages.

## Production TODOs (known, deliberate v1 gaps)

- **Email delivery** (receipts / magic links) — access links currently live on the success page only. Wire up Resend/Postmark in `markOrderPaid`.
- **Stripe receipts/email**: Stripe can send payment receipts, but CVUnicorn still needs app-level email delivery for dashboard magic links.
- **Infini**: optional crypto provider; verify payload details against a real sandbox event before using it in production.
- **Custom domains** for Unicorn Year are a manual fulfillment step for now.
- **CV file text extraction** — the generator uses pasted bio/CV text today; parse uploaded PDF/DOCX server-side when ready.
- `/account` lookup without a link requires emailing support; add magic-link email auth when email delivery exists.
