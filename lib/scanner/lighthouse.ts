import type { LighthouseScores } from "./types";

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

interface PsiResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number | null };
      accessibility?: { score: number | null };
      seo?: { score: number | null };
      "best-practices"?: { score: number | null };
    };
    audits?: Record<string, { id: string; title: string; description: string; score: number | null; numericValue?: number }>;
  };
  error?: { message?: string };
}

export async function runLighthouse(url: string): Promise<LighthouseScores> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url,
    strategy: "mobile",
  });
  ["performance", "accessibility", "seo", "best-practices"].forEach((c) =>
    params.append("category", c)
  );
  if (apiKey) params.set("key", apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    const data = (await res.json()) as PsiResponse;
    if (!res.ok || !data.lighthouseResult) {
      return emptyScores(data.error?.message || `PSI HTTP ${res.status}`);
    }
    const cats = data.lighthouseResult.categories || {};
    const audits = data.lighthouseResult.audits || {};

    const failed = Object.values(audits)
      .filter((a) => a && a.score !== null && a.score !== undefined && a.score < 0.9)
      .map((a) => ({ id: a.id, title: a.title, description: a.description, score: a.score }))
      .slice(0, 25);

    return {
      performance: scaleScore(cats.performance?.score),
      accessibility: scaleScore(cats.accessibility?.score),
      seo: scaleScore(cats.seo?.score),
      bestPractices: scaleScore(cats["best-practices"]?.score),
      metrics: {
        lcp: audits["largest-contentful-paint"]?.numericValue,
        cls: audits["cumulative-layout-shift"]?.numericValue,
        fcp: audits["first-contentful-paint"]?.numericValue,
        tbt: audits["total-blocking-time"]?.numericValue,
        si: audits["speed-index"]?.numericValue,
      },
      audits: failed,
      source: "pagespeed-insights",
    };
  } catch (err) {
    return emptyScores(err instanceof Error ? err.message : "PSI request failed");
  } finally {
    clearTimeout(timer);
  }
}

function scaleScore(s: number | null | undefined): number | null {
  if (s === null || s === undefined) return null;
  return Math.round(s * 100);
}

function emptyScores(error: string): LighthouseScores {
  return {
    performance: null,
    accessibility: null,
    seo: null,
    bestPractices: null,
    source: "unavailable",
    error,
  };
}
