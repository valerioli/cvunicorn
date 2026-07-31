export default function SiteMockup() {
  return (
    <div className="reveal relative mx-auto w-full max-w-3xl" aria-hidden="true">
      <div className="motion-float card relative overflow-hidden shadow-[0_28px_80px_rgba(6,27,49,0.1)]">
        <div className="flex items-center gap-2 border-b border-[#e5edf5] bg-[#f8fafd] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full border border-[#d6d9fc]" />
          <span className="h-2.5 w-2.5 rounded-full border border-[#d6d9fc]" />
          <span className="h-2.5 w-2.5 rounded-full border border-[#d6d9fc]" />
          <span className="mx-auto flex items-center gap-1.5 rounded-[4px] border border-[#e5edf5] bg-white px-3 py-1 text-[11px] text-[#50617a]">
            <svg className="h-3 w-3 text-[#533afd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            mayachen.cvunicorn.com
          </span>
        </div>
        <div className="relative h-[500px] overflow-hidden bg-[#171721] sm:h-[560px]">
          <iframe
            title="Maya Chen generated website preview"
            src="/case-study-sites/maya-chen?lang=en&embed=1&style=mercury"
            className="pointer-events-none h-[1120px] w-[200%] origin-top-left scale-50 border-0 bg-[#171721]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#171721] to-transparent" />
        </div>
      </div>
      <div className="motion-drift card absolute -bottom-8 -left-4 hidden w-56 p-4 shadow-[0_20px_60px_rgba(6,27,49,0.1)] sm:block">
        <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748d]">
          Maya Chen preview
        </p>
        <div className="mt-3 space-y-2">
          {["Finance hero", "Runway model", "Investor proof", "Contact"].map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-[3px] bg-[#e8e9ff] text-center text-[10px] leading-5 text-[#533afd]">
                {index + 1}
              </span>
              <span className="h-1.5 flex-1 rounded-[2px] bg-[#e5edf5]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
