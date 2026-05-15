import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React, { type ReactElement } from "react";
import { ComplianceReport } from "@/lib/pdf/report";
import type { ScanResult } from "@/lib/scanner/types";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let result: ScanResult;
  try {
    result = (await req.json()) as ScanResult;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!result?.url || !result?.findings) {
    return NextResponse.json({ error: "Missing scan result fields" }, { status: 400 });
  }

  try {
    const element = React.createElement(ComplianceReport, { result }) as unknown as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(element);
    const body = new Uint8Array(buffer);
    const filename = sanitizeFilename(result.finalUrl || result.url);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compliance-report-${filename}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function sanitizeFilename(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/[^a-z0-9.-]/gi, "_");
  } catch {
    return "audit";
  }
}
