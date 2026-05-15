import type { Finding, LighthouseScores, StaticChecks } from "./types";

export function buildPreliminaryFindings(
  staticChecks: StaticChecks,
  lighthouse: LighthouseScores,
  region: "EU" | "IN" | "US" | "GLOBAL"
): Finding[] {
  const findings: Finding[] = [];

  if (!staticChecks.fetched) {
    findings.push({
      id: "fetch-failed",
      category: "security",
      title: "Website could not be fetched",
      severity: "critical",
      detail: `The scanner could not retrieve the page (${staticChecks.fetchError || "unknown error"}).`,
      recommendation: "Verify the URL is reachable and that no firewall is blocking automated audits.",
    });
    return findings;
  }

  if (!staticChecks.hasHttps) {
    findings.push({
      id: "no-https",
      category: "security",
      title: "Site not served over HTTPS",
      severity: "critical",
      detail: "Visitors' data (including form submissions) is transmitted in plaintext.",
      recommendation: "Enable HTTPS via your hosting provider (Let's Encrypt is free).",
    });
  }

  const cookieRegions: Array<"EU" | "IN" | "US" | "GLOBAL"> = ["EU", "IN", "GLOBAL"];
  if (staticChecks.trackersDetected.length > 0 && !staticChecks.cookieBannerDetected) {
    findings.push({
      id: "trackers-no-consent",
      category: "compliance",
      title: "Trackers loaded without a cookie consent banner",
      severity: cookieRegions.includes(region) ? "critical" : "high",
      detail: `Detected: ${staticChecks.trackersDetected.join(", ")}. Loading non-essential trackers before consent likely violates GDPR/ePrivacy (EU) and India's DPDP Act.`,
      recommendation: "Add a CMP (Cookiebot, OneTrust, CookieYes) that blocks non-essential scripts until the user opts in.",
      evidence: staticChecks.trackersDetected.join(", "),
    });
  }

  if (!staticChecks.privacyPolicyLink) {
    findings.push({
      id: "no-privacy-policy",
      category: "compliance",
      title: "No privacy policy link found",
      severity: "high",
      detail: "A linked privacy policy is required by GDPR, India's DPDP Act, and CCPA. We could not find one in your footer or nav.",
      recommendation: "Publish a privacy policy and link to it in the footer of every page.",
    });
  }

  if (!staticChecks.termsLink) {
    findings.push({
      id: "no-terms",
      category: "compliance",
      title: "No terms of service link found",
      severity: "medium",
      detail: "Terms of service protect your business and clarify the user contract.",
      recommendation: "Publish terms of service / terms of use and link them in the footer.",
    });
  }

  if (staticChecks.cookieBannerDetected === false && staticChecks.trackersDetected.length === 0) {
    findings.push({
      id: "no-tracker-no-banner",
      category: "compliance",
      title: "No cookie consent UI detected",
      severity: "low",
      detail: "We did not detect any analytics or tracking scripts, so a consent banner may not be required. Verify manually if you add any tracking later.",
      recommendation: "Add a CMP before introducing analytics, ads, or social-media pixels.",
    });
  }

  // Accessibility — alt text
  if (staticChecks.imagesTotal > 0) {
    const missingRatio = staticChecks.imagesMissingAlt / staticChecks.imagesTotal;
    if (missingRatio > 0.3) {
      findings.push({
        id: "alt-text-missing-many",
        category: "accessibility",
        title: `${staticChecks.imagesMissingAlt} of ${staticChecks.imagesTotal} images missing alt text`,
        severity: "high",
        detail: "Screen readers cannot describe these images. This fails WCAG 2.1 AA (1.1.1 Non-text Content).",
        recommendation: "Add descriptive alt text to all meaningful images. Use alt=\"\" only for decorative ones.",
        evidence: `${staticChecks.imagesMissingAlt}/${staticChecks.imagesTotal}`,
      });
    } else if (missingRatio > 0.1) {
      findings.push({
        id: "alt-text-missing-some",
        category: "accessibility",
        title: `${staticChecks.imagesMissingAlt} images missing alt text`,
        severity: "medium",
        detail: "Some images do not have alt attributes, harming screen reader users.",
        recommendation: "Audit images for missing alt attributes.",
        evidence: `${staticChecks.imagesMissingAlt}/${staticChecks.imagesTotal}`,
      });
    }
  }

  if (!staticChecks.lang) {
    findings.push({
      id: "no-html-lang",
      category: "accessibility",
      title: "Missing <html lang=\"…\"> attribute",
      severity: "medium",
      detail: "Screen readers and translation tools rely on the document language declaration.",
      recommendation: "Add lang attribute on the <html> tag (e.g. lang=\"en\").",
    });
  }

  if (staticChecks.headings.h1 === 0) {
    findings.push({
      id: "no-h1",
      category: "seo",
      title: "Page has no <h1> heading",
      severity: "medium",
      detail: "Search engines and assistive tech use the H1 to understand the page topic.",
      recommendation: "Add exactly one descriptive <h1> per page.",
    });
  } else if (staticChecks.headings.h1 > 1) {
    findings.push({
      id: "multiple-h1",
      category: "seo",
      title: `Page has ${staticChecks.headings.h1} <h1> headings`,
      severity: "low",
      detail: "Multiple H1s dilute topical clarity for search engines.",
      recommendation: "Consolidate to a single <h1> per page; demote others to <h2>.",
    });
  }

  if (!staticChecks.title) {
    findings.push({
      id: "no-title",
      category: "seo",
      title: "Page is missing a <title>",
      severity: "high",
      detail: "Search results and browser tabs rely on the document title.",
      recommendation: "Add a unique 50-60 character <title> per page.",
    });
  } else if (staticChecks.title.length < 10 || staticChecks.title.length > 70) {
    findings.push({
      id: "title-length",
      category: "seo",
      title: `Title length is ${staticChecks.title.length} characters`,
      severity: "low",
      detail: "Search engines truncate long titles; very short titles are uninformative.",
      recommendation: "Aim for 50-60 characters in the title tag.",
    });
  }

  if (!staticChecks.metaDescription) {
    findings.push({
      id: "no-meta-description",
      category: "seo",
      title: "Missing meta description",
      severity: "medium",
      detail: "Without one, Google generates snippets that may not reflect your value proposition.",
      recommendation: "Add a 150-160 character meta description summarizing the page.",
    });
  }

  if (!staticChecks.hasViewport) {
    findings.push({
      id: "no-viewport",
      category: "accessibility",
      title: "Missing responsive viewport meta tag",
      severity: "high",
      detail: "Without <meta name=\"viewport\">, mobile browsers render the desktop layout zoomed out.",
      recommendation: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
    });
  }

  if (!staticChecks.hasCanonical) {
    findings.push({
      id: "no-canonical",
      category: "seo",
      title: "No canonical URL declared",
      severity: "low",
      detail: "Canonical URLs help avoid duplicate-content penalties.",
      recommendation: "Add <link rel=\"canonical\" href=\"…\"> to each page.",
    });
  }

  if (staticChecks.formsWithoutLabels > 0) {
    findings.push({
      id: "forms-no-labels",
      category: "accessibility",
      title: `${staticChecks.formsWithoutLabels} form(s) with unlabeled inputs`,
      severity: "high",
      detail: "Form fields without <label>, aria-label, or aria-labelledby fail WCAG 2.1 (3.3.2 Labels or Instructions).",
      recommendation: "Associate every input with a <label for> or use aria-label.",
    });
  }

  if (staticChecks.linksWithoutText > 0) {
    findings.push({
      id: "links-no-text",
      category: "accessibility",
      title: `${staticChecks.linksWithoutText} link(s) with no accessible text`,
      severity: "medium",
      detail: "Links without text, aria-label, or image alt fail screen-reader navigation.",
      recommendation: "Ensure every <a> has visible text or an aria-label.",
    });
  }

  // Lighthouse-derived
  const ls = lighthouse;
  if (ls.source === "pagespeed-insights") {
    if (typeof ls.performance === "number" && ls.performance < 50) {
      findings.push({
        id: "low-performance",
        category: "performance",
        title: `Mobile performance score is ${ls.performance}/100`,
        severity: "high",
        detail: "Slow pages hurt conversions and SEO rankings.",
        recommendation: "Optimize images, defer JS, enable caching, and use a CDN.",
        evidence: `LCP ${ls.metrics?.lcp ? Math.round(ls.metrics.lcp) + "ms" : "n/a"}, CLS ${ls.metrics?.cls?.toFixed(2) || "n/a"}`,
      });
    } else if (typeof ls.performance === "number" && ls.performance < 90) {
      findings.push({
        id: "moderate-performance",
        category: "performance",
        title: `Mobile performance score is ${ls.performance}/100`,
        severity: "medium",
        detail: "There is room to improve Core Web Vitals on mobile.",
        recommendation: "Inspect Lighthouse opportunities — compress images, eliminate render-blocking resources.",
      });
    }
    if (typeof ls.accessibility === "number" && ls.accessibility < 90) {
      findings.push({
        id: "lighthouse-a11y",
        category: "accessibility",
        title: `Lighthouse accessibility score is ${ls.accessibility}/100`,
        severity: ls.accessibility < 70 ? "high" : "medium",
        detail: "Lighthouse flags common issues like color contrast, ARIA misuse, and form labels.",
        recommendation: "Run Lighthouse locally and fix flagged audits in priority order.",
      });
    }
    if (typeof ls.seo === "number" && ls.seo < 90) {
      findings.push({
        id: "lighthouse-seo",
        category: "seo",
        title: `Lighthouse SEO score is ${ls.seo}/100`,
        severity: ls.seo < 70 ? "high" : "medium",
        detail: "Lighthouse flags fundamentals like crawlability, meta tags, and tap-target sizing.",
        recommendation: "Address Lighthouse SEO audits — they map directly to Google's ranking signals.",
      });
    }
  } else {
    findings.push({
      id: "no-lighthouse",
      category: "performance",
      title: "Lighthouse audit unavailable",
      severity: "info",
      detail: `PageSpeed Insights did not return results (${ls.error || "no error reported"}).`,
      recommendation: "Verify the site is publicly reachable; configure PAGESPEED_API_KEY for higher quota.",
    });
  }

  return findings;
}
