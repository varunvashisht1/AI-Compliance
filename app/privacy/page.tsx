import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `Privacy policy for ${SITE.name} — what we collect, what we don't, and your rights.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Privacy
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">Privacy policy</h1>
      <p className="mt-3 text-sm text-slate-500">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="prose prose-slate mt-8 max-w-none">
        <h2>Summary</h2>
        <p>
          {SITE.name} is a web audit tool. We collect almost no personal data. We do
          not sell any data. We do not run advertising or tracking pixels on this
          site.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>URL you submit for scanning.</strong> Passed to our scan pipeline
            (server-side fetch + Google PageSpeed Insights + Anthropic Claude API).
            Not persisted to our infrastructure.
          </li>
          <li>
            <strong>Basic request metadata.</strong> Standard server logs (IP, user
            agent, timestamp) used to debug abuse and keep the service running.
            Retained for up to 30 days, then deleted.
          </li>
        </ul>

        <h2>What we don't collect</h2>
        <ul>
          <li>No analytics or behavior tracking pixels on this website.</li>
          <li>No cookies for advertising or profiling.</li>
          <li>No email signup — you don't need an account to use this tool.</li>
          <li>No persistent storage of your scan results.</li>
        </ul>

        <h2>Sub-processors</h2>
        <p>The scan pipeline calls these services with the URL you provide:</p>
        <ul>
          <li>
            <strong>Anthropic (Claude API).</strong> Receives the scan signals and
            the URL string, returns a structured audit. Governed by{" "}
            <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              Anthropic's privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Google (PageSpeed Insights API).</strong> Receives the URL,
            returns Lighthouse scores. Governed by Google's privacy policy.
          </li>
          <li>
            <strong>Vercel (hosting).</strong> Hosts the application. Governed by
            Vercel's data processing terms.
          </li>
        </ul>

        <h2>Your rights</h2>
        <p>
          You can request deletion of any logs related to your usage by emailing the
          maintainer. Because we don't persist scan results, there's typically
          nothing personal to delete beyond standard server logs.
        </p>

        <h2>Children</h2>
        <p>This service is not directed at children under 13.</p>

        <h2>Changes</h2>
        <p>
          We'll update this page if the data we handle changes. The "last updated"
          date will reflect the change.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions, open an issue on the GitHub repository or contact
          the maintainer listed there.
        </p>
      </div>
    </article>
  );
}
