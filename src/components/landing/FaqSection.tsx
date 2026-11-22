"use client";

import React, { useRef } from "react";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { FaqAccordion } from "@/components/shared/FaqAccordion";

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="flex min-h-[80svh] items-center bg-surface"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="gsap-reveal mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Tanya Jawab
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-5xl">
            Pertanyaan yang sering diajukan.
          </h2>
        </div>

        <div className="gsap-reveal">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
