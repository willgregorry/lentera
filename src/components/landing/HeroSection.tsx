"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHeroReveal } from "@/hooks/useGsapReveal";
import { SplitText } from "@/components/shared/SplitText";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-76px)] items-center overflow-hidden border-b border-border-subtle bg-surface"
    >
      {/* Full-bleed warm elderly care photograph */}
      <img
        src="/images/hero_care.jpg"
        alt="Pendampingan lansia yang hangat di rumah bersama Lentera"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right select-none"
      />

      {/* Smooth left-to-right readability scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/15 sm:via-white/85"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-xl text-left">
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-6xl">
            <SplitText text="Jaga orang tua di rumah," immediate />
            <span className="block text-primary">
              <SplitText
                text="tanpa cemas dari kejauhan."
                immediate
                delay={0.22}
              />
            </span>
          </h1>

          <p className="gsap-hero-item mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            Rekrut caregiver terverifikasi, pantau kondisi harian secara
            real-time, dan terima ringkasan perawatan cerdas dalam satu tempat.
          </p>

          <div className="gsap-hero-item mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href="/login?role=family"
              className="btn-diagonal-secondary inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white"
            >
              <span>Mulai Pantau</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/register?role=caregiver"
              className="inline-flex items-center rounded-full border border-border bg-surface/90 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:bg-canvas-subtle"
            >
              Daftar Caregiver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
