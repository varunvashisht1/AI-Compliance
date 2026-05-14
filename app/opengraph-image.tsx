import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = SITE.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #3b0764 100%)",
          color: "#fff",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#a5b4fc", letterSpacing: -0.5 }}>
            {SITE.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Audit your site for GDPR,
            <br />
            accessibility & SEO — free.
          </div>
          <div style={{ fontSize: 26, color: "#cbd5e1", maxWidth: 1000 }}>
            Paste a URL. AI-powered report in under a minute. PDF included.
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 22, color: "#94a3b8" }}>
          <span>GDPR / DPDP / CCPA</span>
          <span>·</span>
          <span>WCAG 2.1 AA</span>
          <span>·</span>
          <span>Core Web Vitals</span>
          <span>·</span>
          <span>Powered by Claude</span>
        </div>
      </div>
    ),
    size
  );
}
