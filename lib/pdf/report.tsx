import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ScanResult, Finding } from "../scanner/types";

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: "Helvetica", fontSize: 10, color: "#0b0f14", lineHeight: 1.4 },
  header: { borderBottom: 2, borderColor: "#6366f1", paddingBottom: 12, marginBottom: 16 },
  brand: { fontSize: 10, color: "#6366f1", marginBottom: 4 },
  h1: { fontSize: 22, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  url: { fontSize: 11, color: "#475569" },
  meta: { fontSize: 9, color: "#64748b", marginTop: 4 },
  summaryRow: { flexDirection: "row", marginVertical: 12, gap: 8 },
  scoreBox: { flex: 1, padding: 10, border: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  scoreLabel: { fontSize: 8, color: "#64748b", textTransform: "uppercase" },
  scoreValue: { fontSize: 22, fontFamily: "Helvetica-Bold", marginTop: 4 },
  gradeBadge: { padding: 12, backgroundColor: "#6366f1", color: "#fff", borderRadius: 4, marginBottom: 12 },
  gradeBadgeText: { color: "#fff", fontSize: 11 },
  h2: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 16, marginBottom: 8, borderBottom: 1, borderColor: "#e2e8f0", paddingBottom: 4 },
  narrative: { fontSize: 10, marginBottom: 10, color: "#1e293b" },
  priorityItem: { flexDirection: "row", marginBottom: 4 },
  priorityBullet: { width: 12, color: "#6366f1", fontFamily: "Helvetica-Bold" },
  priorityText: { flex: 1 },
  finding: { marginBottom: 10, paddingBottom: 10, borderBottom: 1, borderColor: "#f1f5f9" },
  findingHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  findingTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, flex: 1 },
  sev: { fontSize: 8, padding: 2, paddingHorizontal: 6, borderRadius: 3, color: "#fff", textTransform: "uppercase" },
  sevCritical: { backgroundColor: "#b91c1c" },
  sevHigh: { backgroundColor: "#dc2626" },
  sevMedium: { backgroundColor: "#d97706" },
  sevLow: { backgroundColor: "#0891b2" },
  sevInfo: { backgroundColor: "#64748b" },
  findingDetail: { fontSize: 9, color: "#334155", marginBottom: 3 },
  findingRec: { fontSize: 9, color: "#0b0f14" },
  findingRecLabel: { fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, fontSize: 8, color: "#94a3b8", textAlign: "center" },
});

const sevStyle = (s: string) =>
  s === "critical" ? styles.sevCritical : s === "high" ? styles.sevHigh : s === "medium" ? styles.sevMedium : s === "low" ? styles.sevLow : styles.sevInfo;

const fmtScore = (s: number | null) => (s === null || s === undefined ? "—" : String(s));

export function ComplianceReport({ result }: { result: ScanResult }) {
  const groups = groupFindings(result.findings);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AI Compliance Scanner — Audit Report</Text>
          <Text style={styles.h1}>Website Compliance Audit</Text>
          <Text style={styles.url}>{result.finalUrl}</Text>
          <Text style={styles.meta}>
            Scanned {new Date(result.scannedAt).toLocaleString()} · Region: {result.region}
          </Text>
        </View>

        <View style={styles.gradeBadge}>
          <Text style={[styles.gradeBadgeText, { fontFamily: "Helvetica-Bold", fontSize: 13 }]}>
            Overall grade: {result.summary.overallGrade} · Risk: {result.summary.riskLevel.toUpperCase()}
          </Text>
          <Text style={styles.gradeBadgeText}>{result.summary.headline}</Text>
        </View>

        <View style={styles.summaryRow}>
          <ScoreBox label="Compliance" value={fmtScore(result.scores.compliance)} />
          <ScoreBox label="Performance" value={fmtScore(result.scores.performance)} />
          <ScoreBox label="Accessibility" value={fmtScore(result.scores.accessibility)} />
          <ScoreBox label="SEO" value={fmtScore(result.scores.seo)} />
          <ScoreBox label="Best Practices" value={fmtScore(result.scores.bestPractices)} />
        </View>

        {result.aiNarrative && (
          <>
            <Text style={styles.h2}>Executive summary</Text>
            <Text style={styles.narrative}>{result.aiNarrative}</Text>
          </>
        )}

        {result.summary.topPriorities.length > 0 && (
          <>
            <Text style={styles.h2}>Top priorities</Text>
            {result.summary.topPriorities.map((p, i) => (
              <View key={i} style={styles.priorityItem}>
                <Text style={styles.priorityBullet}>{i + 1}.</Text>
                <Text style={styles.priorityText}>{p}</Text>
              </View>
            ))}
          </>
        )}

        {Object.entries(groups).map(([cat, items]) =>
          items.length === 0 ? null : (
            <View key={cat} wrap>
              <Text style={styles.h2}>{titleCase(cat)} ({items.length})</Text>
              {items.map((f) => (
                <View key={f.id} style={styles.finding} wrap={false}>
                  <View style={styles.findingHead}>
                    <Text style={styles.findingTitle}>{f.title}</Text>
                    <Text style={[styles.sev, sevStyle(f.severity)]}>{f.severity}</Text>
                  </View>
                  <Text style={styles.findingDetail}>{f.detail}</Text>
                  <Text style={styles.findingRec}>
                    <Text style={styles.findingRecLabel}>Fix: </Text>
                    {f.recommendation}
                  </Text>
                  {f.evidence && (
                    <Text style={[styles.findingDetail, { color: "#64748b", marginTop: 2 }]}>
                      Evidence: {f.evidence}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `AI Compliance Scanner · Page ${pageNumber} of ${totalPages} · Automated audit — verify findings before acting on legal advice`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

function ScoreBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.scoreBox}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value}</Text>
    </View>
  );
}

function groupFindings(findings: Finding[]): Record<string, Finding[]> {
  const order: Finding["category"][] = ["compliance", "privacy", "security", "accessibility", "seo", "performance"];
  const out: Record<string, Finding[]> = {};
  for (const cat of order) out[cat] = [];
  const sevRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  for (const f of findings) {
    if (!out[f.category]) out[f.category] = [];
    out[f.category].push(f);
  }
  for (const cat of Object.keys(out)) {
    out[cat].sort((a, b) => (sevRank[a.severity] ?? 5) - (sevRank[b.severity] ?? 5));
  }
  return out;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
