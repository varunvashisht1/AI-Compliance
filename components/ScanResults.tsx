"use client";

import { useState } from "react";
import type { Finding, ScanResult } from "@/lib/scanner/types";
import { ScoreGauge } from "./ScoreGauge";

const SEV_BADGE: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border border-red-200",
  high: "bg-orange-100 text-orange-800 border border-orange-200",
  medium: "bg-amber-100 text-amber-800 border border-amber-200",
  low: "bg-sky-100 text-sky-800 border border-sky-200",
  info: "bg-slate-100 text-slate-700 border border-slate-200",
};

const GRADE_GRADIENT: Record<string, string> = {
  A: "from-emerald-500 to-teal-500",
  B: "from-green-500 to-emerald-500",
  C: "from-amber-500 to-orange-500",
  D: "from-orange-500 to-red-500",
  F: "from-red-600 to-rose-700",
};

const CATEGORY_LABEL: Record<Finding["category"], string> = {
  compliance: "Compliance",
  privacy: "Privacy",
  security: "Security",
  accessibility: "Accessibility",
  seo: "SEO",
  performance: "Performance",
};

const CATEGORY_ICON: Record<Finding["category"], string> = {
  compliance: "⚖️",
  privacy: "🔐",
  security: "🛡️",
  accessibility: "♿",
  seo: "🔎",
  performance: "⚡",
};

const CATEGORY_ORDER: Finding["category"][] = [
  "compliance",
  "privacy",
  "security",
  "accessibility",
  "seo",
  "performance",
];

export function ScanResults({ result }: { result: ScanResult }) {
  const [downloading, setDownloading] = useState(false);
  const [filter, setFilter] = useState<Finding["category"] | "all">("all");

  async function downloadPdf() {
    setDownloading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) {
        const txt = await res.text();
        alert(`PDF generation failed: ${txt}`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      try {
        a.download = `compliance-report-${new URL(result.finalUrl).hostname}.pdf`;
      } catch {
        a.download = "compliance-report.pdf";
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const counts: Record<Finding["severity"], number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const f of result.findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: result.findings
      .filter((f) => f.category === cat)
      .sort((a, b) => sevRank(a.severity) - sevRank(b.severity)),
  })).filter((g) => g.items.length > 0);

  const visibleGroups = filter === "all" ? grouped : grouped.filter((g) => g.cat === filter);
  const grade = result.summary.overallGrade;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero card */}
      <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${GRADE_GRADIENT[grade] || "from-slate-600 to-slate-800"} p-1 shadow-xl shadow-indigo-100/40`}>
        <div className="rounded-[14px] bg-white/5 backdrop-blur-sm">
          <div className="flex flex-col gap-6 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-6xl font-bold backdrop-blur-sm ring-1 ring-white/20">
                {grade}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Overall grade · Risk: {result.summary.riskLevel}
                </div>
                <h2 className="mt-1 text-2xl font-bold leading-tight">
                  {result.summary.headline}
                </h2>
                <a
                  href={result.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
                >
                  {result.finalUrl}
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M7 17l10-10M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={downloadPdf}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M22 12a10 10 0 01-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Generating PDF…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score gauges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ScoreGauge label="Compliance" value={result.scores.compliance} />
        <ScoreGauge label="Performance" value={result.scores.performance} />
        <ScoreGauge label="Accessibility" value={result.scores.accessibility} />
        <ScoreGauge label="SEO" value={result.scores.seo} />
        <ScoreGauge label="Best practices" value={result.scores.bestPractices} />
      </div>

      {/* Severity counts */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="text-sm font-semibold text-slate-700">Findings:</div>
        {(["critical", "high", "medium", "low", "info"] as const).map((sev) =>
          counts[sev] > 0 ? (
            <span key={sev} className={`badge ${SEV_BADGE[sev]}`}>
              {counts[sev]} {sev}
            </span>
          ) : null
        )}
        <span className="ml-auto text-xs text-slate-500">
          Scanned {new Date(result.scannedAt).toLocaleString()} · Region: {result.region}
        </span>
      </div>

      {/* Executive narrative */}
      {result.aiNarrative && (
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              AI executive summary
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
            {result.aiNarrative}
          </p>
        </div>
      )}

      {/* Top priorities */}
      {result.summary.topPriorities.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Top priorities
            </div>
          </div>
          <ol className="mt-4 space-y-3">
            {result.summary.topPriorities.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                  {i + 1}
                </span>
                <span className="text-slate-800">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`chip transition ${filter === "all" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : ""}`}
        >
          All ({result.findings.length})
        </button>
        {grouped.map(({ cat, items }) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`chip transition ${filter === cat ? "border-indigo-300 bg-indigo-50 text-indigo-700" : ""}`}
          >
            <span>{CATEGORY_ICON[cat]}</span>
            {CATEGORY_LABEL[cat]} ({items.length})
          </button>
        ))}
      </div>

      {/* Findings */}
      {visibleGroups.map(({ cat, items }) => (
        <section key={cat} className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            <span className="text-xl">{CATEGORY_ICON[cat]}</span>
            {CATEGORY_LABEL[cat]}
            <span className="text-slate-400">· {items.length}</span>
          </h3>
          <ul className="divide-y divide-slate-100">
            {items.map((f) => (
              <li key={f.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="font-semibold text-slate-900">{f.title}</div>
                  <span className={`badge ${SEV_BADGE[f.severity] || SEV_BADGE.info}`}>
                    {f.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.detail}</p>
                <div className="mt-2.5 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-sm text-slate-800">
                  <span className="mr-1 font-semibold text-indigo-700">Fix:</span>
                  {f.recommendation}
                </div>
                {f.evidence && (
                  <p className="mt-2 font-mono text-xs text-slate-500">↳ {f.evidence}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <details className="card p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          Show raw scan data (JSON)
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function sevRank(s: string): number {
  return { critical: 0, high: 1, medium: 2, low: 3, info: 4 }[s] ?? 5;
}
