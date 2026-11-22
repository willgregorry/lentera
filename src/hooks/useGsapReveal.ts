"use client";

import { RefObject, useEffect } from "react";
import { ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/gsap";

export function useHeroReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".gsap-hero-item", el);
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, el);

    return () => ctx.revert();
  }, [containerRef]);
}

export function useSectionReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".gsap-reveal", el);
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [containerRef]);
}
