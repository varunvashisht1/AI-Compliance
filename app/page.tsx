import Link from "next/link";
import { ScanForm } from "@/components/ScanForm";
import { SITE } from "@/lib/site";

export const metadata = {
  title: undefined,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — Free GDPR, Accessibility & SEO Audit`,
    description: SITE.description,
    url: SITE.url,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ChecksGrid />
      <HowItWorksTeaser />
      <Comparison />
      <FAQ />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg radial-fade" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/40 via-violet-200/30 to-fuchsia-200/40 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            Powered by Claude AI · Free · No signup
          </div>
          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Find every <span className="gradient-text">compliance, accessibility, and SEO</span> issue on your website — in 60 seconds.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-slate-600 sm:text-lg">
            Paste a URL. We scan for GDPR, India DPDP, CCPA, WCAG 2.1, Core Web
            Vitals, and SEO — then Claude writes a prioritized, plain-English
            fix list and a downloadable PDF report.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="chip"><span className="text-emerald-500">✓</span> GDPR &amp; ePrivacy</span>
            <span className="chip"><span className="text-emerald-500">✓</span> India DPDP Act</span>
            <span className="chip"><span className="text-emerald-500">✓</span> WCAG 2.1 AA</span>
            <span className="chip"><span className="text-emerald-500">✓</span> Core Web Vitals</span>
            <span className="chip"><span className="text-emerald-500">✓</span> PDF report</span>
          </div>
        </div>

        <div id="scan" className="mx-auto mt-10 max-w-3xl scroll-mt-20">
          <ScanForm />
        </div>

        <SocialProof />
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <div className="mx-auto mt-12 max-w-4xl">
      <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
        Trusted signal sources
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
        <span className="font-semibold">Anthropic Claude</span>
        <span aria-hidden>·</span>
        <span className="font-semibold">Google Lighthouse</span>
        <span aria-hidden>·</span>
        <span className="font-semibold">PageSpeed Insights</span>
        <span aria-hidden>·</span>
        <span className="font-semibold">WCAG 2.1</span>
        <span aria-hidden>·</span>
        <span className="font-semibold">EDPB Guidelines</span>
      </div>
    </div>
  );
}

const CHECKS: Array<{ title: string; desc: string; icon: string }> = [
  { title: "Cookie consent", desc: "Detects trackers loading before consent. Flags GDPR / ePrivacy / DPDP risk. Recognizes Cookiebot, OneTrust, Didomi, CookieYes, and others.", icon: "🍪" },
  { title: "Privacy & legal", desc: "Validates privacy policy, terms, contact / imprint links — required by GDPR, DPDP, and CCPA.", icon: "⚖️" },
  { title: "Accessibility (WCAG 2.1)", desc: "Alt text coverage, form labels, link text, language attribute, viewport — plus Lighthouse audits.", icon: "♿" },
  { title: "SEO fundamentals", desc: "Title, meta description, canonical, H1 usage, Open Graph, schema — the basics that move rankings.", icon: "🔎" },
  { title: "Core Web Vitals", desc: "Mobile LCP, CLS, FCP, TBT, Speed Index via Google PageSpeed Insights — Google's own ranking signals.", icon: "⚡" },
  { title: "Tracker inventory", desc: "GA4, GTM, Meta Pixel, Hotjar, Mixpanel, Segment, LinkedIn, TikTok, HubSpot, Intercom and more.", icon: "🕵️" },
  { title: "Security baseline", desc: "HTTPS enforcement, secure-by-default headers, and tracker leakage before consent.", icon: "🔒" },
  { title: "AI prioritized fixes", desc: "Claude reads every signal and writes a non-technical, ordered fix list for your developer or designer.", icon: "🧠" },
  { title: "PDF report", desc: "Branded, paginated audit — share with your team, client, or compliance lead in one click.", icon: "📄" },
];

function ChecksGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          What we check
        </div>
        <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Nine consultants in a single button.
        </h2>
        <p className="mt-3 text-balance text-slate-600">
          Pulled together so you don't have to run five different tools, then translate them.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHECKS.map((c) => (
          <div key={c.title} className="group card p-5 transition hover:border-indigo-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 text-xl">
                {c.icon}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{c.title}</div>
                <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: 1, title: "Fetch the page", desc: "We grab the live HTML with a polite, identified crawler — no headless browser bloat." },
  { n: 2, title: "Run the signal layer", desc: "Cheerio parses the DOM, PageSpeed Insights runs a full Lighthouse audit in parallel." },
  { n: 3, title: "AI synthesis", desc: "Claude (Sonnet 4.6) reads every signal and writes a prioritized, plain-English audit." },
  { n: 4, title: "Get your report", desc: "Browse on screen, download as PDF, hand it to your developer or compliance lead." },
];

function HowItWorksTeaser() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            How it works
          </div>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built on the world's best signal sources, fused by Claude.
          </h2>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="card relative p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                {s.n}
              </div>
              <div className="mt-3 font-semibold text-slate-900">{s.title}</div>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 text-center">
          <Link href="/how-it-works" className="btn-secondary">
            Read the technical breakdown →
          </Link>
        </div>
      </div>
    </section>
  );
}

const COMPARISON_ROWS: Array<{ label: string; us: boolean | string; competitors: Record<string, boolean | string> }> = [
  { label: "GDPR / cookie consent", us: true, competitors: { Lighthouse: false, "Cookiebot scan": true, WAVE: false, GTmetrix: false, "SEMrush Audit": false } },
  { label: "WCAG accessibility", us: true, competitors: { Lighthouse: true, "Cookiebot scan": false, WAVE: true, GTmetrix: false, "SEMrush Audit": "partial" } },
  { label: "SEO fundamentals", us: true, competitors: { Lighthouse: true, "Cookiebot scan": false, WAVE: false, GTmetrix: false, "SEMrush Audit": true } },
  { label: "Core Web Vitals", us: true, competitors: { Lighthouse: true, "Cookiebot scan": false, WAVE: false, GTmetrix: true, "SEMrush Audit": "partial" } },
  { label: "AI narrative + fix list", us: true, competitors: { Lighthouse: false, "Cookiebot scan": false, WAVE: false, GTmetrix: false, "SEMrush Audit": false } },
  { label: "India DPDP / multi-region", us: true, competitors: { Lighthouse: false, "Cookiebot scan": false, WAVE: false, GTmetrix: false, "SEMrush Audit": false } },
  { label: "Free, no signup", us: true, competitors: { Lighthouse: true, "Cookiebot scan": "email", WAVE: true, GTmetrix: "limited", "SEMrush Audit": false } },
  { label: "Downloadable PDF", us: true, competitors: { Lighthouse: "manual", "Cookiebot scan": true, WAVE: false, GTmetrix: true, "SEMrush Audit": true } },
];

function Comparison() {
  const competitors = Object.keys(COMPARISON_ROWS[0].competitors);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          How we compare
        </div>
        <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          One tool, every audit your SMB needs.
        </h2>
        <p className="mt-3 text-balance text-slate-600">
          Most free scanners cover one slice. We unify them and add an AI analyst on top.
        </p>
      </div>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className="rounded-l-xl border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                Capability
              </th>
              <th scope="col" className="border-b-2 border-indigo-500 bg-indigo-50 px-4 py-3 text-center font-bold text-indigo-700">
                {SITE.name}
              </th>
              {competitors.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`border-b border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700 ${i === competitors.length - 1 ? "rounded-r-xl" : ""}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, idx) => (
              <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-800">
                  {row.label}
                </td>
                <td className="border-b border-slate-100 bg-indigo-50/30 px-4 py-3 text-center">
                  <Cell value={row.us} primary />
                </td>
                {competitors.map((c) => (
                  <td key={c} className="border-b border-slate-100 px-4 py-3 text-center">
                    <Cell value={row.competitors[c]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Capability comparison reflects free-tier offerings as of 2026. We're not affiliated with any of these tools.
      </p>
    </section>
  );
}

function Cell({ value, primary = false }: { value: boolean | string; primary?: boolean }) {
  if (value === true) {
    return (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${primary ? "bg-indigo-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>
        ✓
      </span>
    );
  }
  if (value === false) {
    return <span className="text-slate-400">—</span>;
  }
  return <span className="text-xs font-medium text-slate-600">{value}</span>;
}

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is this a substitute for a real compliance lawyer?",
    a: "No. We surface signals and write a triage-grade audit. For binding legal advice — especially before a launch or fundraise — talk to a qualified privacy lawyer in your jurisdiction.",
  },
  {
    q: "Do you store the scanned URL or its content?",
    a: "The scan runs server-side in a serverless function. We don't persist the page HTML or the URL. The result is returned directly to your browser.",
  },
  {
    q: "Why does the AI miss something my SPA clearly does?",
    a: "We analyze the initial HTML response and Lighthouse data. If your app renders cookies / banners purely client-side post-hydration, static HTML may miss them. Lighthouse runs JS, so it still catches many of those signals.",
  },
  {
    q: "Can I run this on a staging environment?",
    a: "Yes, as long as the URL is publicly reachable (no Basic Auth, no IP allow-listing). Otherwise PageSpeed Insights can't reach it.",
  },
  {
    q: "Is there an API?",
    a: "Yes — POST a URL to /api/scan and we return a full JSON audit. POST that JSON to /api/report to get a PDF. See the GitHub README.",
  },
  {
    q: "How does this support India's DPDP Act specifically?",
    a: "Pick region: India when you scan. We weight cookie consent, notice, and data-fiduciary signals against DPDP requirements alongside global checks.",
  },
];

function FAQ() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            FAQ
          </div>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Questions, answered.
          </h2>
        </div>
        <dl className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group card p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900">
                <span>{f.q}</span>
                <svg className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-10 text-white shadow-xl shadow-indigo-200/40 sm:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Stop guessing whether your site is compliant.
          </h2>
          <p className="mt-3 text-balance text-base text-indigo-100 sm:text-lg">
            One URL. Sixty seconds. A real audit you can act on today.
          </p>
          <div className="mt-6">
            <Link
              href="#scan"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              Run a free audit →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
