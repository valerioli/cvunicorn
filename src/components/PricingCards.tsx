import Link from "next/link";
import { plans } from "@/content/plans";

export default function PricingCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`card card-hover reveal relative flex flex-col p-7 ${
            plan.highlight ? "ring-glow" : ""
          }`}
        >
          {plan.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-iris-500 to-rose-500 px-3.5 py-1 text-xs font-semibold text-white shadow-lg">
              Most popular
            </span>
          )}
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-300">
            {plan.name}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-5xl font-semibold text-white">
              {plan.priceLabel}
            </span>
            <span className="text-sm text-ink-400">{plan.period}</span>
          </div>
          <p className="mt-2 text-sm text-ink-300">{plan.tagline}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-mint-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={`/checkout?plan=${plan.id}`}
            className={`${plan.highlight ? "btn-primary" : "btn-ghost"} mt-7 w-full px-5 py-3 text-sm`}
          >
            {plan.cta}
          </Link>
          <p className="mt-3 text-center text-xs text-ink-400">
            One-time payment · No subscription traps
          </p>
        </div>
      ))}
    </div>
  );
}
