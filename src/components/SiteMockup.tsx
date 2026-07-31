/** Pure-CSS mockup of a generated personal site — restrained product UI,
 *  no decorative illustration assets. */
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
            amara-osei.com
          </span>
        </div>
        <div className="motion-scan relative grid gap-6 p-6 sm:grid-cols-[1.1fr_0.9fr] sm:p-8">
          <div className="space-y-4">
            <div className="h-2 w-20 rounded-[2px] bg-[#533afd]" />
            <div className="space-y-2">
              <div className="h-5 w-4/5 rounded-[2px] bg-[#061b31]" />
              <div className="h-5 w-3/5 rounded-[2px] bg-[#061b31]" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-2 w-full rounded-[2px] bg-[#e5edf5]" />
              <div className="h-2 w-11/12 rounded-[2px] bg-[#e5edf5]" />
              <div className="h-2 w-3/4 rounded-[2px] bg-[#e5edf5]" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-28 rounded-[4px] bg-[#533afd]" />
              <div className="h-8 w-24 rounded-[4px] border border-[#b9b9f9]" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3">
              {["$30M", "50k+", "12"].map((n, i) => (
                <div key={i} className="rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] p-3 transition duration-300 hover:-translate-y-1">
                  <div className="font-display text-lg font-light text-[#061b31]">{n}</div>
                  <div className="mt-1 h-1.5 w-10 rounded-[2px] bg-[#d6d9fc]" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative h-36 overflow-hidden rounded-[4px] border border-[#e5edf5] bg-[#e8e9ff]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(83,58,253,0.22),transparent_55%),radial-gradient(circle_at_74%_28%,rgba(255,255,255,0.9),transparent_18%)]" />
              <div className="absolute bottom-3 left-3 space-y-1.5">
                <div className="h-2 w-16 rounded-[2px] bg-[#533afd]" />
                <div className="h-1.5 w-24 rounded-[2px] bg-[#b9b9f9]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-14 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] transition duration-300 hover:bg-white" />
              <div className="h-14 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] transition duration-300 hover:bg-white" />
              <div className="h-14 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] transition duration-300 hover:bg-white" />
            </div>
            <div className="space-y-2">
              {[100, 85, 70].map((w) => (
                <div key={w} className="flex items-center gap-2 rounded-[4px] border border-[#e5edf5] bg-white px-3 py-2">
                  <div className="h-5 w-5 rounded-[3px] border border-[#d6d9fc] bg-[#e8e9ff]" />
                  <div className="metric-line h-1.5 rounded-[2px] bg-[#e5edf5]" style={{ width: `${w * 0.6}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="motion-drift card absolute -bottom-8 -left-4 hidden w-52 p-4 shadow-[0_20px_60px_rgba(6,27,49,0.1)] sm:block">
        <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748d]">
          Generated structure
        </p>
        <div className="mt-3 space-y-2">
          {["Hero", "Case studies", "Press", "Contact"].map((item, index) => (
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
