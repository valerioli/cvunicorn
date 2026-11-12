import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/storage";
import { isIntake } from "@/lib/intakeValidation";
import type { IntakeData } from "@/lib/intake";

export const runtime = "nodejs";

const DRAFT_TTL = 60 * 60 * 24 * 30; // 30 days

/** POST /api/intake — save a draft (autosaved by the wizard). */
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => null)) as IntakeData | null;
  if (!isIntake(data)) {
    return NextResponse.json({ error: "Invalid draft" }, { status: 400 });
  }
  if (JSON.stringify(data).length > 1_000_000) {
    return NextResponse.json({ error: "Draft too large" }, { status: 413 });
  }
  if (await kvGet(`draft-owner:${data.draftId}`)) return NextResponse.json({ error: "Open this site's dashboard to edit its content." }, { status: 403 });
  await kvSet(`draft:${data.draftId}`, data, DRAFT_TTL);
  return NextResponse.json({ ok: true, draftId: data.draftId });
}

/** GET /api/intake?draft=… — fetch a draft (used by generation & checkout). */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("draft");
  if (!id) return NextResponse.json({ error: "Missing draft id" }, { status: 400 });
  if (await kvGet(`draft-owner:${id}`)) return NextResponse.json({ error: "Use your personal access link" }, { status: 403 });
  const draft = await kvGet<IntakeData>(`draft:${id}`);
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  return NextResponse.json(draft);
}
