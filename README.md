# AI Compliance Scanner

Cloud-only MVP that audits a website for GDPR / DPDP / CCPA compliance, accessibility (WCAG 2.1 AA), SEO basics, and Core Web Vitals — then asks Claude to write a prioritized, plain-English fix list and a downloadable PDF report.

## Stack

| Concern | Tool |
| --- | --- |
| Framework | Next.js 14 (App Router) on Vercel |
| AI analysis | Claude API (`@anthropic-ai/sdk`, default `claude-sonnet-4-6`) |
| Performance / accessibility / SEO scoring | Google PageSpeed Insights API (managed Lighthouse) |
| HTML / DOM analysis | `cheerio` + plain `fetch` |
| PDF report | `@react-pdf/renderer` (server-side, no headless browser) |
| Styling | Tailwind CSS |
| Validation | Zod |

No headless browsers, no databases, no background workers. Everything runs in serverless route handlers.

## What it checks

- **Compliance / privacy:** trackers loaded without a cookie consent banner (GDPR / ePrivacy / DPDP), missing privacy policy, missing terms, missing contact / imprint
- **Cookie management:** detects common CMPs (Cookiebot, OneTrust, Didomi, CookieYes, Termly, Iubenda, TrustArc, Quantcast) and trackers (GA4, GTM, Meta Pixel, Hotjar, Mixpanel, Segment, LinkedIn, TikTok, HubSpot, Intercom)
- **Accessibility:** missing `<html lang>`, missing alt text, unlabeled form inputs, links without accessible text, viewport meta tag, plus Lighthouse accessibility score
- **SEO:** title, meta description, canonical, H1 usage, OG tags, plus Lighthouse SEO score
- **Performance:** mobile LCP / CLS / FCP / TBT / Speed Index via PageSpeed Insights
- **Security baseline:** HTTPS enforcement

## Setup

```bash
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY (required) and optionally PAGESPEED_API_KEY
npm install
npm run dev
```

Open <http://localhost:3000>, paste a URL, pick a region, click **Run audit**.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes — without it the app falls back to rule-based findings only | Claude API authentication |
| `PAGESPEED_API_KEY` | No — works without one, but Google rate-limits anonymous calls | Higher PageSpeed Insights quota |
| `ANTHROPIC_MODEL` | No (default `claude-sonnet-4-6`) | Override the Claude model |

## API

### `POST /api/scan`

```json
{ "url": "https://example.com", "region": "EU" }
```

Returns the full `ScanResult` JSON (see `lib/scanner/types.ts`). `region` is one of `EU`, `IN`, `US`, `GLOBAL`.

### `POST /api/report`

Body: the `ScanResult` JSON from `/api/scan`.  
Response: `application/pdf` download.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it on Vercel.
3. Set `ANTHROPIC_API_KEY` (and optionally `PAGESPEED_API_KEY`) in the project's environment variables.
4. Deploy.

The `/api/scan` route is configured with `maxDuration = 90` seconds — bump it on Vercel's Pro plan if you need longer (PageSpeed can take 30–60s for slow sites).

## Limitations

- Static HTML analysis only — JS-rendered SPAs may show fewer rule-based findings, but PageSpeed Insights handles JS-rendered content for accessibility/SEO/perf signals.
- Cookie banner detection is heuristic. False negatives are possible on custom CMPs.
- AI output is best-effort — the app falls back to rule-based findings if the model is unavailable or returns invalid JSON.
- Not legal advice. Use as a starting point, not a substitute for a qualified consultant.
