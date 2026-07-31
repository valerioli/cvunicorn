export default function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`reveal max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-4 text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31] sm:text-4xl md:text-5xl md:leading-[1.03]">
        {title}
      </h2>
      {sub && <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-[#50617a] sm:text-xl">{sub}</p>}
    </div>
  );
}
