import type { IntakeData } from "@/lib/intake";
import { getModule, type ModuleId } from "@/lib/intake";

/** AI site generation — calls the model provider directly over REST
 *  (no SDK dependency).
 *
 *  Default: OpenRouter Chat Completions API with OPENROUTER_API_KEY.
 *  Fallbacks: OpenAI Responses API with OPENAI_API_KEY, or Anthropic Messages API.
 *
 *  Provider can be forced with GENERATION_PROVIDER=openrouter|openai|anthropic.
 *  Model can be overridden with OPENROUTER_GENERATION_MODEL, OPENAI_GENERATION_MODEL,
 *  ANTHROPIC_GENERATION_MODEL, or the legacy GENERATION_MODEL.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_OPENROUTER_MODEL =
  process.env.OPENROUTER_GENERATION_MODEL || process.env.GENERATION_MODEL || "openai/gpt-5.5";
const DEFAULT_OPENAI_MODEL =
  process.env.OPENAI_GENERATION_MODEL || process.env.GENERATION_MODEL || "gpt-5.2";
const DEFAULT_ANTHROPIC_MODEL =
  process.env.ANTHROPIC_GENERATION_MODEL || process.env.GENERATION_MODEL || "claude-sonnet-4-5";

function intakeToBrief(d: IntakeData): string {
  const e = d.essentials;
  const lines: string[] = [
    `# Subject`,
    `Name: ${e.fullName}`,
    `Headline: ${e.headline}`,
    e.profession ? `Field: ${e.profession}` : "",
    e.location ? `Location: ${e.location}` : "",
    e.bio ? `\n# Bio / introduction\n${e.bio}` : "",
    e.cvText ? `\n# CV text\n${e.cvText}` : "",
    e.photo ? `\n# Profile photo\nAvailable at: ${e.photo.url}` : "",
  ];

  for (const id of d.selected) {
    const entries = (d.entries[id] ?? []).filter(
      (en) => Object.values(en.values).some((v) => v.trim()) || en.files.length > 0,
    );
    if (entries.length === 0) continue;
    const def = getModule(id as ModuleId);
    lines.push(`\n# ${def.title} (${entries.length})`);
    entries.forEach((en, i) => {
      lines.push(`## ${def.entryNoun} ${i + 1}`);
      for (const [k, v] of Object.entries(en.values)) {
        if (v.trim()) lines.push(`${k}: ${v}`);
      }
      for (const f of en.files) {
        lines.push(`file: ${f.name} (${f.type}) → ${f.url}`);
      }
    });
  }
  return lines.filter(Boolean).join("\n");
}

const SYSTEM_PROMPT = `You are the design engine of CVUnicorn, producing personal websites of the caliber of a $10,000 studio commission.

You receive a content brief about one person. Return a COMPLETE, standalone HTML document (doctype to </html>) — no explanations, no markdown fences, HTML only.

Design requirements:
- Sophisticated, modern, editorial. Confident typography (Google Fonts via <link>), generous whitespace, a restrained palette derived from the person's field. Dark or light theme — whichever serves the content.
- Fully responsive, mobile-first. Subtle CSS-only animations (scroll-margin, hover states, keyframe fades). No external JS libraries; vanilla JS only if truly needed.
- All CSS inline in a single <style> block.

Structure requirements — scale with the material:
- RICH briefs (many modules: work history, photos, writing, projects, press…) become a MULTI-SECTION magazine-style site with a fixed nav linking to distinct, differently-designed sections (like a CMO site with Work / Field / Projects / Writings / About). Every substantial module gets its own section with its own visual treatment: galleries for photos, stat blocks for business results, editorial lists for articles, quote cards for testimonials, timelines for talks.
- SPARSE briefs become a beautiful single-page site: hero, about, one or two content sections, contact. Never pad with empty sections or invent facts.
- Use ONLY facts from the brief. Never fabricate employers, numbers, quotes, or links. Where image URLs are provided, use them in <img> tags with descriptive alt text.

Head requirements:
- <title> "{Name} — {Headline}", meta description summarizing the person, Open Graph tags, and a Schema.org Person JSON-LD script (name, jobTitle, url, sameAs from social links).
- Semantic HTML5 landmarks (header/nav/main/section/footer), correct heading hierarchy, WCAG AA contrast.`;

export async function generateSiteHtml(intake: IntakeData): Promise<string> {
  const provider = chooseProvider();
  const html = await (provider === "openrouter"
    ? generateWithOpenRouter(intake)
    : provider === "anthropic"
      ? generateWithAnthropic(intake)
      : generateWithOpenAI(intake));

  return cleanHtml(html);
}

function chooseProvider(): "openrouter" | "openai" | "anthropic" {
  const forced = process.env.GENERATION_PROVIDER?.toLowerCase();
  if (forced === "openrouter") return "openrouter";
  if (forced === "anthropic") return "anthropic";
  if (forced === "openai") return "openai";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "openrouter";
}

async function generateWithOpenRouter(intake: IntakeData): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Add it to your environment to enable website generation.",
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cvunicorn.com";
  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-Title": "CVUnicorn",
    },
    body: JSON.stringify({
      model: DEFAULT_OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Build this person's website.\n\n${intakeToBrief(intake)}`,
        },
      ],
      max_tokens: 32000,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(await generationApiError("OpenRouter", res));
  }

  const json = (await res.json()) as {
    choices?: {
      message?: {
        content?: string | { type?: string; text?: string }[];
      };
    }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((item) => item.text ?? "").join("");
  }
  return "";
}

async function generateWithOpenAI(intake: IntakeData): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it to your environment to enable website generation.",
    );
  }

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_OPENAI_MODEL,
      instructions: SYSTEM_PROMPT,
      input: `Build this person's website.\n\n${intakeToBrief(intake)}`,
      max_output_tokens: 32000,
    }),
  });

  if (!res.ok) {
    throw new Error(await generationApiError("OpenAI", res));
  }

  const json = (await res.json()) as {
    output_text?: string;
    output?: {
      content?: { type?: string; text?: string }[];
    }[];
  };

  if (typeof json.output_text === "string" && json.output_text.trim()) {
    return json.output_text;
  }

  return (
    json.output
      ?.flatMap((item) => item.content ?? [])
      .filter((content) => content.type === "output_text" || content.type === "text")
      .map((content) => content.text ?? "")
      .join("") ?? ""
  );
}

async function generateWithAnthropic(intake: IntakeData): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add it to your environment to enable website generation.",
    );
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_ANTHROPIC_MODEL,
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Build this person's website.\n\n${intakeToBrief(intake)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(await generationApiError("Anthropic", res));
  }

  const json = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  return (
    json.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("") ?? ""
  );
}

async function generationApiError(
  provider: "OpenRouter" | "OpenAI" | "Anthropic",
  res: Response,
): Promise<string> {
  const text = await res.text().catch(() => "");
  let message = text.slice(0, 300);
  let code = "";
  try {
    const parsed = JSON.parse(text) as {
      error?: { message?: string; code?: string; type?: string };
    };
    message = parsed.error?.message ?? message;
    code = parsed.error?.code ?? parsed.error?.type ?? "";
  } catch {}

  if (
    (provider === "OpenAI" || provider === "OpenRouter") &&
    (code === "credit_balance_exhausted" ||
      code === "insufficient_quota" ||
      /no credits remaining|insufficient credits|insufficient balance|quota/i.test(message))
  ) {
    return `${provider} API has no credits remaining. Add credits in ${provider} billing, then try generation again.`;
  }

  return `${provider} generation API error (${res.status}): ${message}`;
}

function cleanHtml(raw: string): string {
  let html = raw;
  // Strip accidental markdown fences and any preamble before <!doctype…
  html = html.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/, "");
  const docStart = html.search(/<!doctype html/i);
  if (docStart > 0) html = html.slice(docStart);
  if (!/<html[\s>]/i.test(html)) {
    throw new Error("Generation produced invalid output — please try again.");
  }
  return html.trim();
}

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `site-${suffix}`;
}
