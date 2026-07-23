export function UnicornMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cvu-g" x1="4" y1="28" x2="28" y2="4">
          <stop offset="0%" stopColor="#7f5bff" />
          <stop offset="55%" stopColor="#f753a8" />
          <stop offset="100%" stopColor="#ffb85c" />
        </linearGradient>
      </defs>
      {/* Unicorn horn as an upward spiral / growth mark */}
      <path
        d="M16 2.5 22.5 25c.9 3-1.4 4.5-6.5 4.5S8.6 28 9.5 25L16 2.5Z"
        fill="url(#cvu-g)"
      />
      <path
        d="m16 2.5 2.2 7.6-5.6 1.9L16 2.5Zm3.3 11.4 1.5 5.2-8.3 2.8 1.3-4.6 5.5-3.4Z"
        fill="rgba(8,7,13,0.35)"
      />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <UnicornMark />
      {!compact && (
        <span className="font-display text-xl font-semibold tracking-tight text-white">
          CV<span className="text-gradient">Unicorn</span>
        </span>
      )}
    </span>
  );
}
