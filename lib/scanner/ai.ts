import Anthropic from "@anthropic-ai/sdk";
import type { Finding, LighthouseScores, StaticChecks } from "./types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are a senior web compliance and accessibility auditor advising a small business.
You analyze a website's static HTML signals and Lighthouse metrics, then produce a concise, prioritized audit.
Cover: GDPR / DPDP (India) / general privacy, cookie consent, accessibility (WCAG 2.1 AA), SEO fundamentals, and general legal risk.
Be specific and pragmatic. Avoid generic platitudes. Cite the evidence you were given.
Output STRICT JSON only — no prose, no markdown, no code fences.`;

export interface AiAnalysis {
  findings: Finding[];
  narrative: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  complianceScore: number;
  topPriorities: string[];
  headline: string;
}

export async function analyzeWithClaude(input: {
  url: string;
  region: "EU" | "IN" | "US" | "GLOBAL";
  staticChecks: StaticChecks;
  lighthouse: LighthouseScores;
  preliminaryFindings: Finding[];
}): Promise<AiAnalysis> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback(input.preliminaryFindings, "ANTHROPIC_API_KEY not configured — using rule-based findings only.");
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userPayload = {
    url: input.url,
    region: input.region,
    lighthouse: {
      performance: input.lighthouse.performance,
      accessibility: input.lighthouse.accessibility,
      seo: input.lighthouse.seo,
      bestPractices: input.lighthouse.bestPractices,
      metrics: input.lighthouse.metrics,
      topFailedAudits: input.lighthouse.audits?.slice(0, 15),
      source: input.lighthouse.source,
      error: input.lighthouse.error,
    },
    staticChecks: input.staticChecks,
    preliminaryFindings: input.preliminaryFindings,
  };

  const userMessage = `Analyze this website audit data for ${input.region} compliance and produce a JSON report.

INPUT DATA:
${JSON.stringify(userPayload, null, 2)}

Produce JSON with this exact shape:
{
  "headline": "one-sentence summary of overall standing (max 140 chars)",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "complianceScore": 0-100 integer,
  "topPriorities": ["short imperative fix", ...up to 5],
  "narrative": "2-3 paragraph plain-English summary of biggest issues and what to do, written for a non-technical SMB owner",
  "findings": [
    {
      "id": "short-kebab-id",
      "category": "compliance" | "accessibility" | "seo" | "performance" | "privacy" | "security",
      "title": "short title",
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "detail": "what's wrong and why it matters (1-3 sentences)",
      "recommendation": "specific action to take (1-2 sentences)",
      "evidence": "the data point that triggered this (optional)"
    }
  ]
}

Rules:
- Include 8-15 findings total, prioritized by severity.
- If a tracker is present without a detected cookie banner, that is a critical GDPR/ePrivacy issue in EU and a high-severity issue elsewhere.
- If no privacy policy link found, that is high severity universally.
- Missing alt text > 30% of images is high; > 10% is medium.
- Reflect Lighthouse scores: < 50 = high severity, 50-89 = medium, >= 90 = info/low.
- Do not fabricate evidence not in the input data.
- Output ONLY the JSON object. No backticks, no commentary.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return fallback(input.preliminaryFindings, "AI returned no text content.");
    }

    const parsed = parseJson(textBlock.text);
    if (!parsed) {
      return fallback(input.preliminaryFindings, "AI response was not valid JSON.");
    }

    return {
      findings: Array.isArray(parsed.findings) ? parsed.findings : input.preliminaryFindings,
      narrative: typeof parsed.narrative === "string" ? parsed.narrative : "",
      riskLevel: parsed.riskLevel || "medium",
      complianceScore: typeof parsed.complianceScore === "number" ? parsed.complianceScore : 50,
      topPriorities: Array.isArray(parsed.topPriorities) ? parsed.topPriorities.slice(0, 5) : [],
      headline: typeof parsed.headline === "string" ? parsed.headline : "Audit complete.",
    };
  } catch (err) {
    return fallback(
      input.preliminaryFindings,
      `Claude API error: ${err instanceof Error ? err.message : "unknown"}`
    );
  }
}

function parseJson(text: string): any | null {
  const trimmed = text.trim();
  // Strip code fences if model added them despite instructions
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : trimmed;
  try {
    return JSON.parse(body);
  } catch {
    const start = body.indexOf("{");
    const end = body.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(body.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function fallback(findings: Finding[], reason: string): AiAnalysis {
  const severityScore: Record<string, number> = { critical: 30, high: 15, medium: 7, low: 3, info: 0 };
  const deduction = findings.reduce((s, f) => s + (severityScore[f.severity] || 0), 0);
  const complianceScore = Math.max(0, 100 - deduction);
  const riskLevel =
    complianceScore >= 85 ? "low" : complianceScore >= 65 ? "medium" : complianceScore >= 40 ? "high" : "critical";
  return {
    findings,
    narrative: `Automated rule-based audit. ${reason}`,
    riskLevel: riskLevel as AiAnalysis["riskLevel"],
    complianceScore,
    topPriorities: findings
      .filter((f) => f.severity === "critical" || f.severity === "high")
      .slice(0, 5)
      .map((f) => f.recommendation),
    headline: `Found ${findings.length} issues across compliance, accessibility, and SEO.`,
  };
}
