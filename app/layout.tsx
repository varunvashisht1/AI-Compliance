import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Compliance Scanner",
  description:
    "Free AI-powered audit of your website's GDPR, accessibility, SEO, and privacy compliance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900">{children}</body>
    </html>
  );
}
