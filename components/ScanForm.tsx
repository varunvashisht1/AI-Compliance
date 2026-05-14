"use client";

import { useEffect, useRef, useState } from "react";
import type { ScanResult } from "@/lib/scanner/types";
import { ScanResults } from "./ScanResults";

type Region = "EU" | "IN" | "US" | "GLOBAL";

const REGIONS: Array<{ value: Region; label: string; hint: string }> = [
  { value: "GLOBAL", label: "Global", hint: "General compliance baseline" },
  { value: "EU", label: "EU · GDPR", hint: "GDPR + ePrivacy strict" },
  { value: "IN", label: "India · DPDP", hint: "DPDP Act 2023" },
  { value: "US", label: "US · CCPA", hint: "CCPA / CPRA" },
];

const EXAMPLES = [
  { url: "wikipedia.org", label: "wikipedia.org" },
  { url: "github.com", label: "github.com" },
  { url: "stripe.com", label: "stripe.com" },
];

const SCAN_STEPS = [
  "Resolving URL and fetching HTML…",
  "Parsing DOM for cookie banners, trackers, and policy links…",
  "Running Lighthouse via PageSpeed Insights…",
  "Auditing accessibility (WCAG 2.1) and SEO fundamentals…",
  "Asking Claude to synthesize a prioritized fix list…",
  "Finalizing audit report…",
];

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState<Region>("GLOBAL");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      setStepIdx(0);
      stepTimer.current = setInterval(() => {
        setStepIdx((i) => (i < SCAN_STEPS.length - 1 ? i + 1 : i));
      }, 5000);
    } else if (stepTimer.current) {
      clearInterval(stepTimer.current);
      stepTimer.current = null;
    }
    return () => {
      if (stepTimer.current) clearInterval(stepTimer.current);
    };
  }, [loading]);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, region }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Scan failed (HTTP ${res.status})`);
      } else {
        setResult(data as ScanResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="card-elevated overflow-hidden p-2"
      >
        <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-stretch">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              className="input pl-10 text-base"
              placeholder="your-website.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
              aria-label="Website URL"
              autoComplete="url"
              spellCheck={false}
            />
          </div>
          <select
            className="input sm:w-48"
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            disabled={loading}
            aria-label="Region"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="btn-primary px-6 text-base sm:w-44"
            disabled={loading || !url}
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M22 12a10 10 0 01-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Scanning…
              </>
            ) : (
              <>
                Audit now
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.url}
                type="button"
                onClick={() => setUrl(ex.url)}
                disabled={loading}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50"
              >
                {ex.label}
              </button>
            ))}
          </div>
          <div className="text-slate-400">
            {REGIONS.find((r) => r.value === region)?.hint}
          </div>
        </div>
      </form>

      {loading && (
        <div className="mt-5 card animate-fade-in p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-900">Auditing your site…</span>
            <span className="text-slate-500">{stepIdx + 1} / {SCAN_STEPS.length}</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${((stepIdx + 1) / SCAN_STEPS.length) * 100}%` }}
            />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {SCAN_STEPS.map((step, i) => (
              <li
                key={i}
                className={`flex items-center gap-2 ${
                  i < stepIdx
                    ? "text-emerald-700"
                    : i === stepIdx
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {i < stepIdx ? (
                    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i === stepIdx ? (
                    <svg className="h-4 w-4 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M22 12a10 10 0 01-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <span className="font-semibold">Scan failed: </span>
          {error}
        </div>
      )}

      {result && (
        <div ref={resultsRef} className="mt-10 scroll-mt-20">
          <ScanResults result={result} />
        </div>
      )}
    </div>
  );
}
