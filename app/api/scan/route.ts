import { NextResponse } from "next/server";
import { z } from "zod";
import { scanWebsite } from "@/lib/scanner";

export const runtime = "nodejs";
export const maxDuration = 90;
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  url: z.string().min(3).max(2048),
  region: z.enum(["EU", "IN", "US", "GLOBAL"]).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const result = await scanWebsite(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
