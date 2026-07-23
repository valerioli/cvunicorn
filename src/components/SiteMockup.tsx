/** Pure-CSS mockup of a generated personal site — no image assets,
 *  loads instantly, looks premium in the hero. */
export default function SiteMockup() {
  return (
    <div className="reveal relative mx-auto w-full max-w-3xl" aria-hidden="true">
      {/* glow */}
      <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-tr from-iris-500/25 via-rose-500/15 to-amber-400/10 blur-3xl" />
      <div className="card relative overflow-hidden rounded-2xl border-white/10">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/3 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white/6 px-3 py-1 text-[11px] text-ink-300">
            <svg className="h-3 w-3 text-mint-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            amara-osei.com
          </span>
        </div>
        {/* page */}
        <div className="grid gap-6 p-6 sm:grid-cols-[1.1fr_0.9fr] sm:p-8">
          <div className="space-y-4">
            <div className="h-2 w-20 rounded-full bg-iris-400/60" />
            <div className="space-y-2">
              <div className="h-5 w-4/5 rounded-md bg-white/25" />
              <div className="h-5 w-3/5 rounded-md bg-white/25" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-2 w-full rounded-full bg-white/10" />
              <div className="h-2 w-11/12 rounded-full bg-white/10" />
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-28 rounded-full bg-gradient-to-r from-iris-500 to-rose-500" />
              <div className="h-8 w-24 rounded-full border border-white/15" />
            </div>
            {/* stats row */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              {["$30M", "50k+", "12"].map((n, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/4 p-3">
                  <div className="text-gradient font-display text-lg font-semibold">{n}</div>
                  <div className="mt-1 h-1.5 w-10 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {/* portrait */}
            <div className="relative h-36 overflow-hidden rounded-xl bg-gradient-to-br from-iris-600/50 via-ink-700 to-rose-500/35">
              <div className="absolute bottom-3 left-3 space-y-1.5">
                <div className="h-2 w-16 rounded-full bg-white/40" />
                <div className="h-1.5 w-24 rounded-full bg-white/20" />
              </div>
            </div>
            {/* gallery */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-14 rounded-lg bg-gradient-to-br from-amber-400/35 to-rose-500/25" />
              <div className="h-14 rounded-lg bg-gradient-to-br from-iris-500/35 to-mint-400/20" />
              <div className="h-14 rounded-lg bg-gradient-to-br from-rose-500/30 to-iris-600/30" />
            </div>
            {/* list items */}
            <div className="space-y-2">
              {[100, 85, 70].map((w) => (
                <div key={w} className="flex items-center gap-2 rounded-lg border border-white/7 bg-white/3 px-3 py-2">
                  <div className="h-5 w-5 rounded-md bg-gradient-to-br from-iris-400/50 to-rose-400/40" />
                  <div className="h-1.5 rounded-full bg-white/12" style={{ width: `${w * 0.6}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* floating badges */}
      <div className="card absolute -left-4 top-24 hidden animate-float items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-ink-200 shadow-2xl md:flex">
        <svg className="h-4 w-4 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.3 6.6.7-5 4.6 1.4 6.6L12 16.9 6.1 20.2l1.4-6.6-5-4.6 6.6-.7L12 2Z"/></svg>
        Design worth paying for
      </div>
      <div className="card absolute -right-3 bottom-16 hidden animate-float items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-ink-200 shadow-2xl [animation-delay:1.8s] md:flex">
        <svg className="h-4 w-4 text-mint-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z"/></svg>
        Live in 4 minutes
      </div>
    </div>
  );
}
