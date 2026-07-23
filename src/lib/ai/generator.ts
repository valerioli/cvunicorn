import type { IntakeData } from "@/lib/intake";
import { getModule, type ModuleId } from "@/lib/intake";

/** AI site generation — calls the Anthropic API directly over REST
 *  (no SDK dependency). Requires ANTHROPIC_API_KEY.
 *  Model can be overridden with GENERATION_MODEL. */

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.GENERATION_MODEL || "claude-sonnet-4-5";

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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add it to your environment to enable website generation.",
    );
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
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
    const text = await res.text().catch(() => "");
    throw new Error(`Generation API error (${res.status}): ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  let html =
    json.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("") ?? "";

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
