"use client";

import React, { useRef } from "react";
import { LANDING_STATS } from "@/content/landing";
import { useSectionReveal } from "@/hooks/useGsapReveal";

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[100svh] items-center border-b border-[#E5E5E5] bg-[#FFFFFF]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="gsap-reveal max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E8912E]">
            Realitas Indonesia
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-5xl">
            Jutaan keluarga bekerja menanggung beban rawat lansia sendirian.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#E5E5E5] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_STATS.map((stat) => (
            <div key={stat.label} className="gsap-reveal">
              <p
                className="font-mono-vital text-4xl font-bold sm:text-5xl"
                style={{ color: stat.accent }}
              >
                {stat.value}
              </p>
              <p className="mt-4 text-base font-semibold leading-snug text-[#1F2937]">
                {stat.label}
              </p>
              <p className="mt-2 text-xs text-[#6B7280]">{stat.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
