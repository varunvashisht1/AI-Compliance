export const SITE = {
  name: "AI Compliance Scanner",
  shortName: "ComplyScan",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ai-compliance.vercel.app",
  description:
    "Free AI-powered website audit. Scan any URL for GDPR, India DPDP, CCPA, WCAG 2.1 accessibility, SEO, and Core Web Vitals — get a prioritized fix list and a PDF report in under a minute.",
  tagline: "Audit your website for GDPR, accessibility, and SEO — in under a minute.",
  ogImageAlt: "AI Compliance Scanner — Free GDPR, accessibility, and SEO audit",
  twitter: "@anthropic",
  author: "AI Compliance Scanner",
  keywords: [
    "GDPR compliance scanner",
    "free website audit",
    "AI website audit",
    "accessibility checker WCAG",
    "cookie consent scanner",
    "India DPDP compliance",
    "CCPA compliance check",
    "SEO audit free",
    "Core Web Vitals checker",
    "privacy policy scanner",
    "Lighthouse audit",
    "website compliance report",
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Scanner" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
] as const;

export const FOOTER_LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
