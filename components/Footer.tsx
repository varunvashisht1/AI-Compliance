import Link from "next/link";
import { FOOTER_LEGAL, NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M5 12l4 4 10-11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {SITE.name}
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            Free AI-powered website compliance, accessibility, and SEO audit. Built for SMBs and the
            agencies that serve them.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-indigo-600" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-indigo-600" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} {SITE.name}. Automated audit — not legal advice.</div>
          <div>Powered by Claude · Lighthouse · Next.js</div>
        </div>
      </div>
    </footer>
  );
}
