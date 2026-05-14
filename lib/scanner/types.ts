export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface Finding {
  id: string;
  category: "compliance" | "accessibility" | "seo" | "performance" | "privacy" | "security";
  title: string;
  severity: Severity;
  detail: string;
  recommendation: string;
  evidence?: string;
}

export interface LighthouseScores {
  performance: number | null;
  accessibility: number | null;
  seo: number | null;
  bestPractices: number | null;
  metrics?: {
    lcp?: number;
    cls?: number;
    fcp?: number;
    tbt?: number;
    si?: number;
  };
  audits?: Array<{ id: string; title: string; description: string; score: number | null }>;
  source: "pagespeed-insights" | "unavailable";
  error?: string;
}

export interface StaticChecks {
  fetched: boolean;
  status?: number;
  finalUrl?: string;
  title?: string;
  metaDescription?: string;
  lang?: string;
  hasViewport: boolean;
  hasFavicon: boolean;
  hasHttps: boolean;
  hasCanonical: boolean;
  ogTags: Record<string, string>;
  privacyPolicyLink?: string;
  termsLink?: string;
  cookiePolicyLink?: string;
  contactLink?: string;
  cookieBannerDetected: boolean;
  trackersDetected: string[];
  imagesTotal: number;
  imagesMissingAlt: number;
  imagesEmptyAlt: number;
  headings: { h1: number; h2: number; h3: number };
  formsWithoutLabels: number;
  linksWithoutText: number;
  externalScripts: number;
  inlineScripts: number;
  rawHtmlLength: number;
  fetchError?: string;
}

export interface ScanRequest {
  url: string;
  region?: "EU" | "IN" | "US" | "GLOBAL";
}

export interface ScanResult {
  url: string;
  finalUrl: string;
  scannedAt: string;
  region: "EU" | "IN" | "US" | "GLOBAL";
  summary: {
    overallGrade: "A" | "B" | "C" | "D" | "F";
    headline: string;
    riskLevel: "low" | "medium" | "high" | "critical";
    topPriorities: string[];
  };
  scores: {
    performance: number | null;
    accessibility: number | null;
    seo: number | null;
    bestPractices: number | null;
    compliance: number | null;
  };
  lighthouse: LighthouseScores;
  staticChecks: StaticChecks;
  findings: Finding[];
  aiNarrative?: string;
}
