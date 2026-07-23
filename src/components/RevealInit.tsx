"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive-enhancement scroll reveal: adds .is-visible to .reveal
 *  elements. Re-runs on route change so client-side navigations work. */
export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const observeAll = () =>
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => io.observe(el));

    // Observe after paint (new page content is in the DOM by then), and
    // watch for late-mounted elements (dynamic wizard steps, etc.).
    const raf = requestAnimationFrame(observeAll);
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
