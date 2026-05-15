import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: `Terms of service for ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Terms
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">Terms of service</h1>
      <p className="mt-3 text-sm text-slate-500">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="prose prose-slate mt-8 max-w-none">
        <h2>Acceptance</h2>
        <p>
          By using {SITE.name}, you agree to these terms. If you don't agree, please
          don't use the service.
        </p>

        <h2>What we provide</h2>
        <p>
          A free, automated, AI-assisted website audit. The output is a triage-grade
          report covering compliance, accessibility, SEO, and performance signals.
        </p>

        <h2>What we don't provide</h2>
        <p>
          <strong>Legal advice.</strong> Nothing in a report constitutes legal,
          regulatory, or accessibility-conformance advice. For binding decisions,
          consult a qualified professional in your jurisdiction.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Scan only websites you own or have authorization to audit.</li>
          <li>Don't use the service to test for or build exploits.</li>
          <li>Don't try to overload the service with automated traffic.</li>
        </ul>

        <h2>Service availability</h2>
        <p>
          We provide the service "as is" without warranties. We may rate-limit,
          suspend, or terminate access at any time, with or without notice.
        </p>

        <h2>Liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for any indirect,
          incidental, or consequential damages arising from your use of the service.
          Our total liability for any claim is capped at the amount you paid us in
          the prior twelve months — which, since the service is free, is zero.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The application code is open-source — see the GitHub repository for license
          terms. Scan results we generate for you are yours to keep, share, and
          redistribute.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. Continued use of the service after a change
          constitutes acceptance of the new terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the jurisdiction the maintainer
          operates from. Disputes will be resolved in the courts of that
          jurisdiction.
        </p>
      </div>
    </article>
  );
}
