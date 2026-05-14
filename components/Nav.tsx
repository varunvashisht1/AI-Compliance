import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold text-slate-900"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm transition group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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
          <span>{SITE.name}</span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="btn-ghost">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#scan" className="btn-primary ml-2">
              Run a free audit
            </Link>
          </li>
        </ul>
        <Link href="/#scan" className="btn-primary md:hidden">
          Audit
        </Link>
      </nav>
    </header>
  );
}
