export type LegalSection = { h: string; body: string[] };

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 pb-20 pt-10 sm:pt-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-400">Last updated: {updated}</p>
      <div className="prose-invert mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-lg font-semibold text-white">{s.h}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-ink-300">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
