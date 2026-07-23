import type { Faq } from "@/content/faqs";

/** Semantic, crawlable FAQ accordion — native <details> keeps content
 *  in the DOM for search engines and AI crawlers, no JS required. */
export default function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-white/8">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-white [&::-webkit-details-marker]:hidden">
            {f.q}
            <svg
              className="h-5 w-5 shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="mt-3 pr-9 text-sm leading-relaxed text-ink-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
