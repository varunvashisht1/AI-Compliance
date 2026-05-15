import { normalizeUrl } from "./fetch";
import { runStaticChecks } from "./static-checks";
import { runLighthouse } from "./lighthouse";
import { buildPreliminaryFindings } from "./rules";
import { analyzeWithClaude } from "./ai";
import type { ScanResult } from "./types";

export async function scanWebsite(input: {
  url: string;
  region?: "EU" | "IN" | "US" | "GLOBAL";
}): Promise<ScanResult> {
  const url = normalizeUrl(input.url);
  const region = input.region || "GLOBAL";

  const [staticChecks, lighthouse] = await Promise.all([runStaticChecks(url), runLighthouse(url)]);

  const preliminary = buildPreliminaryFindings(staticChecks, lighthouse, region);
  const ai = await analyzeWithClaude({
    url,
    region,
    staticChecks,
    lighthouse,
    preliminaryFindings: preliminary,
  });

  const findings = ai.findings.length > 0 ? ai.findings : preliminary;
  const grade = gradeFromScore(ai.complianceScore);

  return {
    url,
    finalUrl: staticChecks.finalUrl || url,
    scannedAt: new Date().toISOString(),
    region,
    summary: {
      overallGrade: grade,
      headline: ai.headline,
      riskLevel: ai.riskLevel,
      topPriorities: ai.topPriorities,
    },
    scores: {
      performance: lighthouse.performance,
      accessibility: lighthouse.accessibility,
      seo: lighthouse.seo,
      bestPractices: lighthouse.bestPractices,
      compliance: ai.complianceScore,
    },
    lighthouse,
    staticChecks,
    findings,
    aiNarrative: ai.narrative,
  };
}

function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

export type { ScanResult } from "./types";
