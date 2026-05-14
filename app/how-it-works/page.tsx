import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Behind the scenes: how the AI Compliance Scanner combines Cheerio static analysis, Google PageSpeed Insights, and Claude to produce a GDPR / DPDP / WCAG / SEO audit in under a minute.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: `How it works · ${SITE.name}`,
    description:
      "Cheerio + PageSpeed Insights + Claude — combined into a single audit pipeline.",
    url: `${SITE.url}/how-it-works`,
  },
};

export default function HowItWorks() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Under the hood
      </div>
      <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        How the scanner actually works.
      </h1>
      <p className="mt-4 text-balance text-lg text-slate-600">
        No magic, no black box. A four-stage pipeline you can audit yourself —
        the whole thing is open-source.
      </p>

      <Section n="1" title="Fetch the page">
        <p>
          We fetch your URL server-side with a polite, identified User-Agent
          (<code>AIComplianceScanner/0.1</code>). The default timeout is 15 seconds.
          We follow redirects so the rest of the pipeline analyzes the canonical
          final URL.
        </p>
        <p>
          We <em>don't</em> use a headless browser for the static layer. The HTML
          is the source of truth for what's served to first-load crawlers and
          older clients, which is what GDPR enforcement bodies and Google's
          first-pass crawler typically see.
        </p>
      </Section>

      <Section n="2" title="Static DOM analysis (Cheerio)">
        <p>
          We load the HTML into <code>cheerio</code> — a server-side jQuery —
          and walk the DOM for:
        </p>
        <ul className="list-disc pl-6">
          <li>Presence of <code>&lt;html lang&gt;</code>, viewport meta, favicon, canonical, OG tags</li>
          <li>Image alt-text coverage (missing vs empty vs present)</li>
          <li>Form fields without labels (WCAG 2.1 — 3.3.2 Labels or Instructions)</li>
          <li>Links with no accessible name</li>
          <li>Footer / nav links matching <em>privacy</em>, <em>terms</em>, <em>cookie</em>, <em>contact / imprint</em></li>
          <li>Cookie / consent banner signatures (Cookiebot, OneTrust, Didomi, CookieYes, Termly, Iubenda, TrustArc, Quantcast, etc.)</li>
          <li>Tracker fingerprints in inline scripts and script srcs (GA4, GTM, Meta Pixel, Hotjar, Mixpanel, Segment, LinkedIn, TikTok, HubSpot, Intercom, ...)</li>
        </ul>
      </Section>

      <Section n="3" title="Lighthouse via PageSpeed Insights">
        <p>
          For performance, accessibility, and SEO scoring we call Google's
          PageSpeed Insights API. Behind that API is a hosted Lighthouse run
          against your URL on a real mobile profile.
        </p>
        <p>
          This gives us authoritative <strong>Core Web Vitals</strong> (LCP, CLS,
          FCP, TBT, Speed Index) without us shipping a Puppeteer or Playwright
          binary — and the scores are the same ones Google uses for ranking.
          Failed audits are passed to Claude as additional evidence.
        </p>
      </Section>

      <Section n="4" title="Rule-based preliminary findings">
        <p>
          Before we call the LLM, deterministic rules generate a preliminary
          finding set: severity, category, evidence, recommendation. This means
          the scanner has a useful baseline output even if Claude is unavailable
          or you choose to run it without an API key.
        </p>
        <p>
          Rules cover the obvious wins: trackers loading before consent (critical
          in GDPR / ePrivacy / DPDP regions), missing privacy policy or terms,
          missing HTTPS, high ratios of unlabeled images, missing H1, missing
          meta description, etc.
        </p>
      </Section>

      <Section n="5" title="Claude synthesis">
        <p>
          The full signal package — Lighthouse scores, raw checks, preliminary
          findings, region context — is handed to{" "}
          <code>claude-sonnet-4-6</code> with a strict-JSON output contract. The
          model returns 8-15 findings with prioritized severity, an executive
          narrative for a non-technical reader, and a top-5 fix list.
        </p>
        <p>
          We parse the JSON defensively (stripping code fences, recovering from
          partial output), and on any failure mode we fall back to the rule-based
          findings so the user always gets a report.
        </p>
      </Section>

      <Section n="6" title="PDF rendering">
        <p>
          The result JSON flows into a <code>@react-pdf/renderer</code> document
          and back to your browser as a paginated PDF. No headless Chromium, no
          screenshot service — pure declarative PDF in a serverless function.
        </p>
      </Section>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="text-sm font-semibold text-slate-900">Want the API?</div>
        <p className="mt-1 text-sm text-slate-600">
          <code>POST /api/scan</code> with <code>{`{ url, region }`}</code> returns
          the full audit JSON. <code>POST /api/report</code> with that JSON returns
          a PDF.
        </p>
        <Link href="/#scan" className="btn-primary mt-4 inline-flex">
          Try it now →
        </Link>
      </div>
    </article>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
          {n}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      </div>
      <div className="prose prose-slate mt-3 max-w-none text-slate-700 [&>p]:my-3 [&>ul]:my-3 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:font-mono">
        {children}
      </div>
    </section>
  );
}
