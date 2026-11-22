"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  immediate?: boolean;
  delay?: number;
}

export function SplitText({
  text,
  className = "",
  immediate = false,
  delay = 0,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const words = el.querySelectorAll<HTMLElement>(".split-word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 125, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power4.out",
          stagger: 0.12,
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  once: true,
                },
              }),
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, immediate]);

  const words = text.split(" ");

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em]"
        >
          <span className="split-word inline-block will-change-transform">
            {word}
            {idx < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
