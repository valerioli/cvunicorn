import { modules, type IntakeData } from "./intake";

/** Validate stored and submitted data before any rendering, checkout or AI call. */
export function isIntake(value: unknown): value is IntakeData {
  if (!value || typeof value !== "object") return false;
  const d = value as IntakeData;
  if (typeof d.updatedAt !== "number" || !Number.isFinite(d.updatedAt)) return false;
  if (typeof d.draftId !== "string" || !/^[a-zA-Z0-9_-]{12,100}$/.test(d.draftId)) return false;
  if (!["valerio", "resend", "mercury", "notion", "active"].includes(d.style)) return false;
  if (d.siteLanguage && !["auto", "en", "zh"].includes(d.siteLanguage)) return false;
  if (!d.essentials || !d.entries || !Array.isArray(d.selected) || d.selected.length > modules.length) return false;
  if (new Set(d.selected).size !== d.selected.length || d.selected.some(id => !modules.some(m => m.id === id))) return false;
  const e = d.essentials;
  if (![e.fullName, e.headline, e.bio, e.email, e.location, e.profession].every(v => typeof v === "string")) return false;
  if (e.fullName.length > 200 || e.headline.length > 500) return false;
  if (e.cvText !== undefined && typeof e.cvText !== "string") return false;
  const validFile = (v: unknown) => {
    if (!v || typeof v !== "object") return false;
    const f = v as Record<string, unknown>;
    return [f.id, f.name, f.type, f.url].every(x => typeof x === "string") &&
      (/^https:\/\//i.test(f.url as string) || /^\/api\/upload\?id=[\w-]+$/.test(f.url as string)) &&
      (f.extractedText === undefined || typeof f.extractedText === "string");
  };
  if ((e.photo && !validFile(e.photo)) || (e.cv && !validFile(e.cv))) return false;
  for (const entries of Object.values(d.entries)) {
    if (!Array.isArray(entries) || entries.length > 100) return false;
    for (const en of entries) {
      if (!en || typeof en.id !== "string" || !en.values || typeof en.values !== "object" || Array.isArray(en.values)) return false;
      if (!Object.values(en.values).every(v => typeof v === "string")) return false;
      if (!Array.isArray(en.files) || !en.files.every(validFile)) return false;
    }
  }
  return JSON.stringify(d).length <= 1_000_000;
}
