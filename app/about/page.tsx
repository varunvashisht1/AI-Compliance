import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About AI Compliance Scanner — an open-source, AI-powered website audit tool for SMBs and the agencies that serve them.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${SITE.name}`,
    description: "An open-source, AI-powered website audit tool for SMBs.",
    url: `${SITE.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        About
      </div>
      <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Compliance audits, democratized.
      </h1>
      <p className="mt-4 text-lg text-slate-700">
        A privacy audit from a boutique law firm runs $5,000-$15,000. An accessibility
        review from a specialist runs $2,000-$8,000. An SEO audit from an agency runs
        $1,000-$5,000. Most small businesses don't have any of those budgets — and so
        they ship websites that quietly accumulate compliance debt.
      </p>
      <p className="mt-4 text-lg text-slate-700">
        {SITE.name} is what happens when you fuse the best free signal sources on the
        internet — Google Lighthouse, the WCAG 2.1 rule set, modern CMP fingerprints —
        with a frontier LLM that can read those signals and write a fix list in plain
        English.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight text-slate-900">
        Who it's for
      </h2>
      <ul className="mt-4 space-y-3 text-slate-700">
        <li className="flex gap-3">
          <span className="text-xl">🏪</span>
          <span><strong>SMB owners</strong> who need to know what's broken before a launch, a sale, or a funding round.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-xl">🛠️</span>
          <span><strong>Web agencies and freelancers</strong> who want to triage a new client's site in 60 seconds — then sell a proper engagement.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-xl">🇮🇳</span>
          <span><strong>Indian businesses</strong> figuring out what the DPDP Act actually means for their site.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-xl">🇪🇺</span>
          <span><strong>EU-facing businesses</strong> who want a quick GDPR / ePrivacy health check.</span>
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-bold tracking-tight text-slate-900">
        What we don't pretend to be
      </h2>
      <p className="mt-3 text-slate-700">
        We're not your lawyer. We don't take liability for compliance decisions. The
        audit is a triage tool — a way to find what's obviously wrong, prioritize it,
        and have a productive conversation with a qualified consultant when you need
        one. If your business depends on a regulatory clearance, hire a human.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight text-slate-900">
        Open source
      </h2>
      <p className="mt-3 text-slate-700">
        The whole thing — scanner pipeline, rule library, AI prompt, PDF renderer — is
        in a public repository. Fork it, run it yourself, send us a pull request.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/#scan" className="btn-primary">
          Run a free audit →
        </Link>
        <Link href="/how-it-works" className="btn-secondary">
          See how it works
        </Link>
      </div>
    </article>
  );
}
