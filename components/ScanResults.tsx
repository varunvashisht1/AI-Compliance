"use client";

import { useState } from "react";
import type { Finding, ScanResult } from "@/lib/scanner/types";

const SEV_BADGE: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border border-red-200",
  high: "bg-orange-100 text-orange-800 border border-orange-200",
  medium: "bg-amber-100 text-amber-800 border border-amber-200",
  low: "bg-sky-100 text-sky-800 border border-sky-200",
  info: "bg-slate-100 text-slate-700 border border-slate-200",
};

const GRADE_COLOR: Record<string, string> = {
  A: "bg-emerald-600",
  B: "bg-green-600",
  C: "bg-amber-500",
  D: "bg-orange-600",
  F: "bg-red-700",
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

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: result.findings
      .filter((f) => f.category === cat)
      .sort(
        (a, b) =>
          (sevRank(a.severity) - sevRank(b.severity))
      ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className={`card p-6 text-white ${GRADE_COLOR[result.summary.overallGrade] || "bg-slate-700"}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">Overall grade</div>
            <div className="mt-1 text-5xl font-bold leading-none">{result.summary.overallGrade}</div>
            <div className="mt-2 text-sm opacity-90">Risk: {result.summary.riskLevel}</div>
          </div>
          <div className="max-w-xl text-right text-sm opacity-95">{result.summary.headline}</div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={downloadPdf} disabled={downloading} className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25 disabled:opacity-50">
            {downloading ? "Generating PDF…" : "Download PDF report"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <ScoreCard label="Compliance" value={result.scores.compliance} />
        <ScoreCard label="Performance" value={result.scores.performance} />
        <ScoreCard label="Accessibility" value={result.scores.accessibility} />
        <ScoreCard label="SEO" value={result.scores.seo} />
        <ScoreCard label="Best practices" value={result.scores.bestPractices} />
      </div>

      {result.aiNarrative && (
        <div className="card p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Executive summary
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {result.aiNarrative}
          </p>
        </div>
      )}

      {result.summary.topPriorities.length > 0 && (
        <div className="card p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Top priorities
          </div>
          <ol className="mt-3 space-y-2">
            {result.summary.topPriorities.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-semibold text-indigo-600">{i + 1}.</span>
                <span className="text-slate-700">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {grouped.map(({ cat, items }) => (
        <section key={cat} className="card p-6">
          <h2 className="mb-3 text-base font-semibold capitalize text-slate-900">
            {cat} <span className="text-slate-400">· {items.length}</span>
          </h2>
          <ul className="divide-y divide-slate-100">
            {items.map((f) => (
              <li key={f.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="font-medium text-slate-900">{f.title}</div>
                  <span className={`badge ${SEV_BADGE[f.severity] || SEV_BADGE.info}`}>
                    {f.severity}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{f.detail}</p>
                <p className="mt-1 text-sm text-slate-800">
                  <span className="font-medium">Fix: </span>
                  {f.recommendation}
                </p>
                {f.evidence && (
                  <p className="mt-1 text-xs text-slate-500">Evidence: {f.evidence}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <details className="card p-6">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          Raw scan data
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number | null }) {
  const display = value === null || value === undefined ? "—" : value;
  const color =
    value === null || value === undefined
      ? "text-slate-400"
      : value >= 90
      ? "text-emerald-600"
      : value >= 70
      ? "text-amber-600"
      : "text-red-600";
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${color}`}>{display}</div>
    </div>
  );
}

function sevRank(s: string): number {
  return { critical: 0, high: 1, medium: 2, low: 3, info: 4 }[s] ?? 5;
}
