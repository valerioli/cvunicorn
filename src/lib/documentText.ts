const MAX_EXTRACTED_CHARS = 80_000;

export type TextExtractionResult = {
  text: string;
  charCount: number;
  error?: string;
};

export async function extractDocumentText(input: {
  bytes: Uint8Array;
  name: string;
  type: string;
}): Promise<TextExtractionResult> {
  try {
    const text = await extractRawText(input);
    const normalized = normalizeText(text);
    if (!normalized) {
      return {
        text: "",
        charCount: 0,
        error:
          "No readable text was found. If this is a scanned resume, upload a text-based PDF/DOCX or paste the CV text.",
      };
    }
    const clipped = normalized.slice(0, MAX_EXTRACTED_CHARS);
    return {
      text: clipped,
      charCount: normalized.length,
      error:
        normalized.length > MAX_EXTRACTED_CHARS
          ? "Text was extracted and trimmed to the first 80,000 characters."
          : undefined,
    };
  } catch (err) {
    return {
      text: "",
      charCount: 0,
      error:
        err instanceof Error && err.message
          ? err.message
          : "We couldn't extract text from this file.",
    };
  }
}

async function extractRawText(input: {
  bytes: Uint8Array;
  name: string;
  type: string;
}): Promise<string> {
  const kind = documentKind(input.name, input.type);
  if (kind === "pdf") return extractPdfText(input.bytes);
  if (kind === "docx") return extractDocxText(input.bytes);
  if (kind === "text") return new TextDecoder("utf-8", { fatal: false }).decode(input.bytes);
  if (kind === "doc") {
    throw new Error(
      "Legacy .doc files can be uploaded, but automatic text extraction supports PDF, DOCX, TXT, and Markdown. Please export this resume as PDF or DOCX.",
    );
  }
  return "";
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const { CanvasFactory } = await import("pdf-parse/worker");
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: bytes, CanvasFactory });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(bytes: Uint8Array): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
  return result.value;
}

function documentKind(name: string, type: string): "pdf" | "docx" | "doc" | "text" | "other" {
  const lowerName = name.toLowerCase();
  const lowerType = type.toLowerCase();
  if (lowerType === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  if (
    lowerType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    return "docx";
  }
  if (lowerType === "application/msword" || lowerName.endsWith(".doc")) return "doc";
  if (
    lowerType.startsWith("text/") ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".md") ||
    lowerName.endsWith(".markdown")
  ) {
    return "text";
  }
  return "other";
}

function normalizeText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}
