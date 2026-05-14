import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare with other tools",
  description:
    "How AI Compliance Scanner compares to Lighthouse, Cookiebot, WAVE, GTmetrix, SEMrush, and other website audit tools — and where AI-driven analysis wins.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: `Compare · ${SITE.name}`,
    description: "AI Compliance Scanner vs Lighthouse, Cookiebot, WAVE, GTmetrix, SEMrush.",
    url: `${SITE.url}/compare`,
  },
};

const TOOLS = [
  {
    name: "Google Lighthouse / PageSpeed Insights",
    pros: ["Authoritative performance, accessibility, and SEO scoring.", "Free, used by Google itself.", "Open-source and well-known."],
    cons: ["Zero compliance, GDPR, or privacy coverage.", "No tracker / cookie analysis.", "Raw audit list — no plain-English fix narrative."],
    fits: "Engineers tuning Core Web Vitals.",
    notFor: "SMB owners who need a compliance report they can act on.",
  },
  {
    name: "Cookiebot scanner",
    pros: ["Strong cookie / consent enumeration.", "Vendor-grade GDPR coverage."],
    cons: ["Cookies only — no SEO, a11y, or performance.", "Free tier nudges toward signup.", "No AI narrative."],
    fits: "Sites already shopping for a CMP.",
    notFor: "Anyone who wants a holistic audit in one report.",
  },
  {
    name: "WAVE (WebAIM)",
    pros: ["Best-in-class accessibility analysis.", "Free, browser-based."],
    cons: ["Accessibility only.", "Manual interpretation.", "No PDF report or fix narrative."],
    fits: "Accessibility consultants and devs.",
    notFor: "Compliance + SEO + perf in one pass.",
  },
  {
    name: "GTmetrix",
    pros: ["Strong performance focus.", "Waterfall visualization."],
    cons: ["Performance only.", "Free tier rate-limited and gated.", "No compliance or a11y output."],
    fits: "Front-end devs tuning load time.",
    notFor: "Multi-domain audit needs.",
  },
  {
    name: "SEMrush / Ahrefs Site Audit",
    pros: ["Deep SEO crawl.", "Backlink and keyword data alongside."],
    cons: ["Paid only.", "Light on GDPR and a11y.", "Designed for marketing teams, not legal."],
    fits: "Marketing teams already paying for SEMrush.",
    notFor: "Founders looking for a free, fast triage.",
  },
  {
    name: "OneTrust / Termly / Iubenda scanners",
    pros: ["Vendor-grade compliance reports.", "Built-in policy generators."],
    cons: ["Heavy signup flow.", "Pricing geared toward mid-market and up.", "No SEO or perf coverage."],
    fits: "Companies already procuring a CMP suite.",
    notFor: "Quick health checks before a launch.",
  },
];

export default function ComparePage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Honest comparison
      </div>
      <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Where {SITE.name} fits — and where it doesn't.
      </h1>
      <p className="mt-4 text-balance text-lg text-slate-600">
        We're not trying to replace SEMrush or WAVE for the people who already
        use them. We're trying to give a small business owner a single,
        confident, prioritized fix list — fast.
      </p>

      <section className="mt-10 card-elevated p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Why this tool exists
        </h2>
        <p className="mt-3 text-slate-700">
          Most SMBs don't have a privacy lawyer, an SEO consultant, and an
          accessibility expert on speed-dial. When they do hire one, the audit
          fee alone runs $1,500-$10,000 per category. The free tools that exist
          each cover <em>one</em> slice and produce raw output that requires a
          specialist to interpret.
        </p>
        <p className="mt-3 text-slate-700">
          {SITE.name} fuses the signals from the best free sources — Cheerio for
          DOM analysis, Google Lighthouse for perf/a11y/SEO, our own rule
          library for compliance — then asks Claude (a frontier LLM) to write a
          report a non-technical operator can actually use.
        </p>
      </section>

      <h2 className="mt-14 text-2xl font-bold tracking-tight text-slate-900">
        Tool-by-tool
      </h2>
      <div className="mt-6 space-y-4">
        {TOOLS.map((t) => (
          <div key={t.name} className="card p-6">
            <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Strengths
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {t.pros.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Limitations
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {t.cons.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-rose-500">✕</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <strong>Best for:</strong> {t.fits} · <strong>Not for:</strong> {t.notFor}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-14 rounded-2xl gradient-bg p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold tracking-tight">
          The one-line summary
        </h2>
        <p className="mt-3 text-indigo-50">
          Use Lighthouse for tuning, WAVE for accessibility deep-dives, SEMrush
          for SEO depth — and use <strong>{SITE.name}</strong> when you need a
          single, fast, prioritized snapshot covering all of it (plus compliance)
          that you can read on the train and hand to your developer.
        </p>
        <Link
          href="/#scan"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Try it now →
        </Link>
      </section>
    </article>
  );
}
