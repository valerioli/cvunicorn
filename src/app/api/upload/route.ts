import { NextRequest, NextResponse } from "next/server";
import { memFilePut, memFileGet } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_PREFIXES = ["image/", "application/pdf", "text/"];
const ALLOWED_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function typeAllowed(type: string): boolean {
  return (
    ALLOWED_PREFIXES.some((p) => type.startsWith(p)) ||
    ALLOWED_TYPES.includes(type)
  );
}

/** POST /api/upload — stores a file, returns { id, name, url, size, type }.
 *  Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set; otherwise an
 *  in-memory dev fallback served from GET /api/upload?id=… */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 8MB limit" }, { status: 413 });
  }
  if (!typeAllowed(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use images, PDF, or Word documents." },
      { status: 415 },
    );
  }

  const id = crypto.randomUUID();
  const safeName = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    // Vercel Blob REST API — no SDK needed.
    const res = await fetch(
      `https://blob.vercel-storage.com/uploads/${id}/${encodeURIComponent(safeName)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${blobToken}`,
          "x-api-version": "7",
          "content-type": file.type || "application/octet-stream",
          "x-add-random-suffix": "0",
        },
        body: file.stream(),
        // @ts-expect-error duplex is required by node fetch for streaming bodies
        duplex: "half",
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Storage upload failed" }, { status: 502 });
    }
    const blob = (await res.json()) as { url: string };
    return NextResponse.json({
      id,
      name: file.name,
      url: blob.url,
      size: file.size,
      type: file.type,
    });
  }

  // Dev fallback: keep in memory, serve back via GET.
  const bytes = new Uint8Array(await file.arrayBuffer());
  memFilePut(id, bytes, file.type || "application/octet-stream", safeName);
  return NextResponse.json({
    id,
    name: file.name,
    url: `/api/upload?id=${id}`,
    size: file.size,
    type: file.type,
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const hit = memFileGet(id);
  if (!hit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(Buffer.from(hit.data), {
    headers: {
      "Content-Type": hit.type,
      "Content-Disposition": `inline; filename="${hit.name}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
