import { NextResponse } from "next/server";
import { getGenerationDiagnostics } from "@/lib/ai/generator";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getGenerationDiagnostics(), {
    headers: { "Cache-Control": "no-store" },
  });
}
