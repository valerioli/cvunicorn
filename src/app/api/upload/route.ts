import { NextRequest, NextResponse } from "next/server";
import { memFilePut, memFileGet } from "@/lib/storage";
import { extractDocumentText } from "@/lib/documentText";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_PREFIXES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "application/pdf", "text/plain", "text/markdown"];
const ALLOWED_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const TEXT_EXTRACTION_PREFIXES = ["text/"];
const TEXT_EXTRACTION_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function typeAllowed(name: string, type: string): boolean {
  const lowerName = name.toLowerCase();
  return (
    ALLOWED_PREFIXES.includes(type) ||
    ALLOWED_TYPES.includes(type) ||
    /\.(pdf|docx?|txt|md|markdown)$/.test(lowerName)
  );
}

function textExtractionAllowed(name: string, type: string): boolean {
  const lowerName = name.toLowerCase();
  return (
    TEXT_EXTRACTION_PREFIXES.some((p) => type.startsWith(p)) ||
    TEXT_EXTRACTION_TYPES.includes(type) ||
    /\.(pdf|docx?|txt|md|markdown)$/.test(lowerName)
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
    return NextResponse.json({ error: "File exceeds 4MB limit" }, { status: 413 });
  }
  if (["image/svg+xml", "text/html", "application/xhtml+xml"].includes(file.type) || /\.(svg|html?|xml)$/i.test(file.name)) return NextResponse.json({ error: "Use PNG, JPEG or WebP for images." }, { status: 415 });
  if (!typeAllowed(file.name, file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use images, PDF, or Word documents." },
      { status: 415 },
    );
  }

  const id = crypto.randomUUID();
  const safeName = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.VERCEL_ENV === "production" && !blobToken) return NextResponse.json({ error: "Uploads are temporarily unavailable. Please paste your CV text and try files again later." }, { status: 503 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const extraction = textExtractionAllowed(file.name, file.type)
    ? await extractDocumentText({
        bytes,
        name: file.name,
        type: file.type || "application/octet-stream",
      })
    : null;

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
        body: bytes,
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
      extractedText: extraction?.text,
      extractedCharCount: extraction?.charCount,
      extractionError: extraction?.error,
    });
  }

  // Dev fallback: keep in memory, serve back via GET.
  memFilePut(id, bytes, file.type || "application/octet-stream", safeName);
  return NextResponse.json({
    id,
    name: file.name,
    url: `/api/upload?id=${id}`,
    size: file.size,
    type: file.type,
    extractedText: extraction?.text,
    extractedCharCount: extraction?.charCount,
    extractionError: extraction?.error,
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
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'",
    },
  });
}
