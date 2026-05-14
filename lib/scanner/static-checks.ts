import * as cheerio from "cheerio";
import type { StaticChecks } from "./types";
import { fetchPage } from "./fetch";

const COOKIE_BANNER_PATTERNS = [
  /cookie/i,
  /consent/i,
  /gdpr/i,
  /cookiebot/i,
  /onetrust/i,
  /didomi/i,
  /cookieyes/i,
  /termly/i,
  /iubenda/i,
  /trustarc/i,
  /quantcast/i,
];

const TRACKER_SIGNATURES: Array<{ name: string; needle: RegExp }> = [
  { name: "Google Analytics (GA4)", needle: /gtag\(|googletagmanager\.com\/gtag|G-[A-Z0-9]{6,}/ },
  { name: "Google Tag Manager", needle: /googletagmanager\.com\/gtm|GTM-[A-Z0-9]+/ },
  { name: "Universal Analytics", needle: /UA-\d{4,}-\d+|google-analytics\.com\/analytics\.js/ },
  { name: "Meta Pixel", needle: /connect\.facebook\.net\/.+\/fbevents\.js|fbq\(/ },
  { name: "Hotjar", needle: /static\.hotjar\.com|hjid/i },
  { name: "Mixpanel", needle: /cdn\.mxpnl\.com|mixpanel\.init/i },
  { name: "Segment", needle: /cdn\.segment\.com|analytics\.load/i },
  { name: "LinkedIn Insight", needle: /snap\.licdn\.com\/li\.lms-analytics/i },
  { name: "TikTok Pixel", needle: /analytics\.tiktok\.com\/i18n\/pixel/i },
  { name: "HubSpot", needle: /js\.hs-scripts\.com|js\.hsforms\.net/i },
  { name: "Intercom", needle: /widget\.intercom\.io/i },
];

const POLICY_LINK_PATTERNS: Array<{ key: keyof Pick<StaticChecks, "privacyPolicyLink" | "termsLink" | "cookiePolicyLink" | "contactLink">; needles: RegExp[] }> = [
  { key: "privacyPolicyLink", needles: [/privacy/i, /data[-\s]?protection/i] },
  { key: "termsLink", needles: [/terms/i, /tos\b/i, /conditions/i, /eula/i] },
  { key: "cookiePolicyLink", needles: [/cookie/i] },
  { key: "contactLink", needles: [/contact/i, /imprint/i, /impressum/i] },
];

export async function runStaticChecks(url: string): Promise<StaticChecks> {
  const page = await fetchPage(url);

  if (!page.ok || !page.html) {
    return {
      fetched: false,
      status: page.status,
      finalUrl: page.finalUrl,
      hasViewport: false,
      hasFavicon: false,
      hasHttps: page.finalUrl.startsWith("https://"),
      hasCanonical: false,
      ogTags: {},
      cookieBannerDetected: false,
      trackersDetected: [],
      imagesTotal: 0,
      imagesMissingAlt: 0,
      imagesEmptyAlt: 0,
      headings: { h1: 0, h2: 0, h3: 0 },
      formsWithoutLabels: 0,
      linksWithoutText: 0,
      externalScripts: 0,
      inlineScripts: 0,
      rawHtmlLength: 0,
      fetchError: page.error || `HTTP ${page.status}`,
    };
  }

  const $ = cheerio.load(page.html);
  const html = page.html;

  const title = $("head > title").first().text().trim() || undefined;
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || undefined;
  const lang = $("html").attr("lang")?.trim() || undefined;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasFavicon = $('link[rel*="icon"]').length > 0;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasHttps = page.finalUrl.startsWith("https://");

  const ogTags: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) ogTags[prop] = content;
  });

  // Image alt analysis
  const imgs = $("img");
  let imagesMissingAlt = 0;
  let imagesEmptyAlt = 0;
  imgs.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined) imagesMissingAlt += 1;
    else if (alt.trim() === "") imagesEmptyAlt += 1;
  });

  const headings = {
    h1: $("h1").length,
    h2: $("h2").length,
    h3: $("h3").length,
  };

  // Forms missing labels
  let formsWithoutLabels = 0;
  $("form").each((_, form) => {
    const inputs = $(form).find("input, select, textarea").filter((_, el) => {
      const type = ($(el).attr("type") || "").toLowerCase();
      return !["hidden", "submit", "button", "image", "reset"].includes(type);
    });
    let unlabeled = 0;
    inputs.each((_, input) => {
      const id = $(input).attr("id");
      const ariaLabel = $(input).attr("aria-label");
      const ariaLabelledBy = $(input).attr("aria-labelledby");
      const placeholderOnly = !id && !ariaLabel && !ariaLabelledBy;
      const labelFor = id ? $(form).find(`label[for="${id}"]`).length > 0 : false;
      if (!labelFor && !ariaLabel && !ariaLabelledBy && placeholderOnly) unlabeled += 1;
    });
    if (unlabeled > 0) formsWithoutLabels += 1;
  });

  // Links missing accessible text
  let linksWithoutText = 0;
  $("a").each((_, a) => {
    const text = $(a).text().trim();
    const ariaLabel = $(a).attr("aria-label");
    const title = $(a).attr("title");
    const hasImageAlt = $(a).find("img[alt]").filter((_, img) => ($(img).attr("alt") || "").trim() !== "").length > 0;
    if (!text && !ariaLabel && !title && !hasImageAlt) linksWithoutText += 1;
  });

  const externalScripts = $('script[src]').length;
  const inlineScripts = $("script:not([src])").length;

  // Cookie banner detection: look for banner-like elements + known CMP signatures
  let cookieBannerDetected = false;
  const lowerHtml = html.toLowerCase();
  if (COOKIE_BANNER_PATTERNS.some((re) => re.test(lowerHtml))) {
    // Confirm it's actually banner-like, not just a privacy link
    const bannerCandidates = $('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i], [id*="gdpr" i], [class*="gdpr" i]');
    if (bannerCandidates.length > 0) cookieBannerDetected = true;
    // CMP vendor signatures are strong evidence on their own
    if (/cookiebot|onetrust|didomi|cookieyes|termly|iubenda|trustarc|quantcast/i.test(html)) cookieBannerDetected = true;
  }

  const trackersDetected: string[] = [];
  for (const sig of TRACKER_SIGNATURES) {
    if (sig.needle.test(html)) trackersDetected.push(sig.name);
  }

  // Policy link detection
  const linkMap: Partial<StaticChecks> = {};
  $("a[href]").each((_, a) => {
    const href = $(a).attr("href") || "";
    const text = $(a).text().trim();
    const haystack = `${href} ${text}`.toLowerCase();
    for (const { key, needles } of POLICY_LINK_PATTERNS) {
      if (linkMap[key]) continue;
      if (needles.some((re) => re.test(haystack))) {
        try {
          linkMap[key] = new URL(href, page.finalUrl).toString();
        } catch {
          linkMap[key] = href;
        }
      }
    }
  });

  return {
    fetched: true,
    status: page.status,
    finalUrl: page.finalUrl,
    title,
    metaDescription,
    lang,
    hasViewport,
    hasFavicon,
    hasHttps,
    hasCanonical,
    ogTags,
    privacyPolicyLink: linkMap.privacyPolicyLink,
    termsLink: linkMap.termsLink,
    cookiePolicyLink: linkMap.cookiePolicyLink,
    contactLink: linkMap.contactLink,
    cookieBannerDetected,
    trackersDetected,
    imagesTotal: imgs.length,
    imagesMissingAlt,
    imagesEmptyAlt,
    headings,
    formsWithoutLabels,
    linksWithoutText,
    externalScripts,
    inlineScripts,
    rawHtmlLength: html.length,
  };
}
