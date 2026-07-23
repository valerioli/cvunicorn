import { featuredShowcase as site } from "@/content/showcase";

export default function ShowcaseFeature() {
  return (
    <div className="card card-hover reveal relative mx-auto max-w-4xl overflow-hidden">
      <div className="grid md:grid-cols-[1fr_1.15fr]">
        {/* Left: identity */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-iris-600/25 via-transparent to-rose-500/15 p-7 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-300">
              Built with CVUnicorn
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold text-white">
              {site.name}
            </h3>
            <p className="mt-1 text-sm text-ink-300">{site.role}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {site.sections.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-ink-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <a
              href={site.url}
              target="_blank"
              rel="noopener"
              className="btn-primary px-5 py-2.5 text-sm"
            >
              Visit the live site
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <p className="mt-3 text-xs text-ink-400">
              What he uploaded: {site.materials}
            </p>
          </div>
        </div>
        {/* Right: story */}
        <div className="p-7 sm:p-8">
          <p className="text-sm leading-relaxed text-ink-200">{site.summary}</p>
          <ul className="mt-6 space-y-3">
            {site.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-ink-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-iris-400 to-rose-400" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
