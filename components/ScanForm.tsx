"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/scanner/types";
import { ScanResults } from "./ScanResults";

type Region = "EU" | "IN" | "US" | "GLOBAL";

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState<Region>("GLOBAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

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
      <form onSubmit={onSubmit} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          className="input flex-1"
          placeholder="https://your-website.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={loading}
          aria-label="Website URL"
        />
        <select
          className="input sm:w-40"
          value={region}
          onChange={(e) => setRegion(e.target.value as Region)}
          disabled={loading}
          aria-label="Region"
        >
          <option value="GLOBAL">Global</option>
          <option value="EU">EU (GDPR)</option>
          <option value="IN">India (DPDP)</option>
          <option value="US">US (CCPA)</option>
        </select>
        <button type="submit" className="btn-primary sm:w-40" disabled={loading || !url}>
          {loading ? "Scanning…" : "Run audit"}
        </button>
      </form>

      {loading && (
        <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          Fetching page, running Lighthouse via PageSpeed Insights, and asking Claude
          for analysis. This usually takes 20-60 seconds.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10">
          <ScanResults result={result} />
        </div>
      )}
    </div>
  );
}
