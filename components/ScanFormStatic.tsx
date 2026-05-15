"use client";

const isStatic = process.env.NEXT_PUBLIC_STATIC_BUILD === "true";
const scannerUrl = process.env.NEXT_PUBLIC_SCANNER_URL || "https://ai-compliance.vercel.app";

const REGIONS = [
  { value: "GLOBAL", label: "Global" },
  { value: "EU", label: "EU · GDPR" },
  { value: "IN", label: "India · DPDP" },
  { value: "US", label: "US · CCPA" },
];

const EXAMPLES = [
  { url: "wikipedia.org", label: "wikipedia.org" },
  { url: "github.com", label: "github.com" },
  { url: "stripe.com", label: "stripe.com" },
];

export function ScanFormStatic() {
  function go(formData: FormData) {
    if (typeof window === "undefined") return;
    const url = String(formData.get("url") || "").trim();
    const region = String(formData.get("region") || "GLOBAL");
    const target = new URL(scannerUrl);
    if (url) target.searchParams.set("url", url);
    if (region) target.searchParams.set("region", region);
    window.location.href = target.toString();
  }

  return (
    <div>
      <form
        action={go}
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
              name="url"
              className="input pl-10 text-base"
              placeholder="your-website.com"
              required
              aria-label="Website URL"
              autoComplete="url"
              spellCheck={false}
            />
          </div>
          <select
            name="region"
            defaultValue="GLOBAL"
            className="input sm:w-48"
            aria-label="Region"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary px-6 text-base sm:w-44">
            Audit now
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.url}
                type="submit"
                name="url"
                value={ex.url}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {ex.label}
              </button>
            ))}
          </div>
          <div className="text-slate-400">
            Hands off to the live scanner →
          </div>
        </div>
      </form>

      {isStatic && (
        <p className="mt-3 text-center text-xs text-slate-500">
          You're viewing the static marketing site. The full AI audit runs on{" "}
          <a className="font-medium text-indigo-600 underline-offset-2 hover:underline" href={scannerUrl}>
            {new URL(scannerUrl).hostname}
          </a>
          .
        </p>
      )}
    </div>
  );
}
