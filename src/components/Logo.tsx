export function UnicornMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 2.5 22.5 25c.9 3-1.4 4.5-6.5 4.5S8.6 28 9.5 25L16 2.5Z"
        fill="#533afd"
      />
      <path
        d="m16 2.5 2.2 7.6-5.6 1.9L16 2.5Zm3.3 11.4 1.5 5.2-8.3 2.8 1.3-4.6 5.5-3.4Z"
        fill="#ffffff"
        opacity="0.28"
      />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <UnicornMark />
      {!compact && (
        <span className="font-display text-xl font-normal tracking-[-0.02em] text-[#061b31]">
          CV<span className="text-[#533afd]">Unicorn</span>
        </span>
      )}
    </span>
  );
}
