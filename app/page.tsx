import { ScanForm } from "@/components/ScanForm";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        AI Compliance Scanner
      </div>
      <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tight text-slate-900">
        Audit your website for GDPR, accessibility, and SEO — in under a minute.
      </h1>
      <p className="mb-8 text-lg text-slate-600">
        Paste a URL. We scan for cookie consent, privacy policy, accessibility gaps, SEO
        mistakes, and Core Web Vitals — then a Claude-powered analyst writes you a
        prioritized fix list and a downloadable PDF report.
      </p>

      <ScanForm />

      <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-5">
            <div className="text-sm font-semibold text-slate-900">{f.title}</div>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500">
        Automated audit. Not legal advice. Verify findings before relying on them for
        compliance decisions.
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    title: "Cookie & consent",
    desc: "Detects trackers loading without consent — flags GDPR / ePrivacy / DPDP risk.",
  },
  {
    title: "Privacy & legal",
    desc: "Checks for privacy policy, terms, contact / imprint, and policy strength.",
  },
  {
    title: "Accessibility",
    desc: "Finds missing alt text, unlabeled forms, missing lang — WCAG 2.1 AA pointers.",
  },
  {
    title: "SEO basics",
    desc: "Title, meta description, headings, canonical, viewport — the fundamentals.",
  },
  {
    title: "Performance",
    desc: "Mobile Core Web Vitals via Google PageSpeed Insights (Lighthouse).",
  },
  {
    title: "PDF report",
    desc: "One-click download — share with your developer or compliance lead.",
  },
];
