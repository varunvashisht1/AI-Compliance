import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE || "http://localhost:3030";
const OUT = "screenshots";

const SAMPLE_RESULT = {
  url: "https://demo-bakery.example.com",
  finalUrl: "https://demo-bakery.example.com",
  scannedAt: new Date().toISOString(),
  region: "EU",
  summary: {
    overallGrade: "C",
    headline: "Trackers loading without consent in the EU and missing privacy policy — fix these first.",
    riskLevel: "high",
    topPriorities: [
      "Add a CMP (Cookiebot, OneTrust, or CookieYes) and gate Google Analytics until consent.",
      "Publish a privacy policy and link it from every page footer.",
      "Add alt text to the 14 images currently missing one.",
      "Compress hero image — LCP is 4.2s on mobile (target < 2.5s).",
      "Add <html lang=\"en\"> for screen-reader and translation tools.",
    ],
  },
  scores: { performance: 52, accessibility: 71, seo: 84, bestPractices: 78, compliance: 48 },
  lighthouse: { performance: 52, accessibility: 71, seo: 84, bestPractices: 78, source: "pagespeed-insights" },
  staticChecks: {
    fetched: true,
    finalUrl: "https://demo-bakery.example.com",
    title: "Sweet Things Bakery · Fresh Daily",
    hasViewport: true,
    hasFavicon: true,
    hasHttps: true,
    hasCanonical: false,
    ogTags: {},
    cookieBannerDetected: false,
    trackersDetected: ["Google Analytics (GA4)", "Meta Pixel", "Hotjar"],
    imagesTotal: 28,
    imagesMissingAlt: 14,
    imagesEmptyAlt: 2,
    headings: { h1: 1, h2: 6, h3: 12 },
    formsWithoutLabels: 1,
    linksWithoutText: 0,
    externalScripts: 12,
    inlineScripts: 4,
    rawHtmlLength: 48210,
  },
  findings: [
    { id: "trackers-no-consent", category: "compliance", title: "Trackers loaded without a cookie consent banner", severity: "critical", detail: "Detected GA4, Meta Pixel, and Hotjar firing on the initial page load. In EU/UK and India, loading non-essential trackers before user opt-in violates GDPR/ePrivacy and the DPDP Act.", recommendation: "Install a CMP (Cookiebot, OneTrust, or CookieYes) that blocks non-essential scripts until the user gives consent.", evidence: "Google Analytics (GA4), Meta Pixel, Hotjar" },
    { id: "no-privacy-policy", category: "compliance", title: "No privacy policy link found", severity: "high", detail: "We could not find a 'privacy' link in the footer or main navigation. A linked privacy policy is required by GDPR, India's DPDP Act, and CCPA.", recommendation: "Publish a privacy policy and link it from the footer of every page." },
    { id: "no-html-lang", category: "accessibility", title: "Missing <html lang=\"…\"> attribute", severity: "medium", detail: "Screen readers and translation tools rely on the document language declaration to choose the right voice and dictionary.", recommendation: "Add a lang attribute on the <html> tag (e.g. lang=\"en\")." },
    { id: "alt-text-missing", category: "accessibility", title: "14 of 28 images missing alt text", severity: "high", detail: "Half of your images have no alt attribute. Screen readers cannot describe them, failing WCAG 2.1 AA (1.1.1 Non-text Content).", recommendation: "Add descriptive alt text to all meaningful images. Use alt=\"\" only for purely decorative ones.", evidence: "14/28" },
    { id: "low-performance", category: "performance", title: "Mobile performance score is 52/100", severity: "high", detail: "Slow pages hurt conversions and SEO rankings.", recommendation: "Optimize images, defer non-critical JS, enable caching, and serve via a CDN.", evidence: "LCP 4200ms, CLS 0.08" },
    { id: "no-canonical", category: "seo", title: "No canonical URL declared", severity: "low", detail: "Canonical URLs help avoid duplicate-content penalties and consolidate ranking signals.", recommendation: "Add <link rel=\"canonical\" href=\"…\"> to each page." },
    { id: "forms-no-labels", category: "accessibility", title: "1 form with unlabeled inputs", severity: "high", detail: "Form fields without a <label>, aria-label, or aria-labelledby fail WCAG 2.1 (3.3.2 Labels or Instructions).", recommendation: "Associate every input with a <label for> or use aria-label." },
    { id: "lighthouse-seo", category: "seo", title: "Lighthouse SEO score is 84/100", severity: "medium", detail: "Lighthouse flags fundamentals like crawlability, meta tags, and tap-target sizing.", recommendation: "Address Lighthouse SEO audits — they map directly to Google's ranking signals." },
  ],
  aiNarrative: "Your bakery's site is friendly and on-brand, but right now it's accumulating compliance debt. The biggest issue is that Google Analytics, the Meta Pixel, and Hotjar all start tracking visitors the moment they land — and you're showing this to EU customers without a consent banner. That's a clear GDPR / ePrivacy violation that regulators have been actively fining for in 2024-2025. Fix this first by installing a CMP like Cookiebot or CookieYes (both have free tiers for small sites).\n\nSecond priority: publish a privacy policy. We couldn't find one linked anywhere, and that's table-stakes under GDPR, DPDP, and CCPA. Use a free generator (Termly, iubenda) and link it from your footer.\n\nThe accessibility issues are real but quick wins — add alt text to the 14 images missing one, add lang=\"en\" to the html tag, and label that one unlabeled form. Performance is in the yellow because your hero image is too large; compress it and you'll jump back into the green.",
};

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
  });

  for (const ctx of [desktop, mobile]) {
    const label = ctx === desktop ? "desktop" : "mobile";
    for (const path of ["/", "/how-it-works", "/compare", "/about", "/privacy"]) {
      const page = await ctx.newPage();
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForTimeout(400);
      const name = path === "/" ? "home" : path.replace(/\//g, "");
      await page.screenshot({ path: `${OUT}/${label}-${name}.png`, fullPage: true });
      console.log(`✓ ${label}-${name}.png`);
      await page.close();
    }
  }

  // Inject sample result into the home page to capture the results UI
  for (const ctx of [desktop, mobile]) {
    const label = ctx === desktop ? "desktop" : "mobile";
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

    // Stub fetch to return our sample result
    await page.route("**/api/scan", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(SAMPLE_RESULT),
      })
    );

    await page.fill('input[aria-label="Website URL"]', "demo-bakery.example.com");
    await page.selectOption('select[aria-label="Region"]', "EU");
    await page.click('button[type="submit"]');
    await page.waitForSelector("text=AI executive summary", { timeout: 10_000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/${label}-results.png`, fullPage: true });
    console.log(`✓ ${label}-results.png`);
    await page.close();
  }

  // Capture the OG image
  const og = await desktop.newPage();
  await og.goto(`${BASE}/opengraph-image`, { waitUntil: "networkidle" });
  await og.setViewportSize({ width: 1200, height: 630 });
  await og.screenshot({ path: `${OUT}/og-image.png`, fullPage: false });
  console.log("✓ og-image.png");

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
