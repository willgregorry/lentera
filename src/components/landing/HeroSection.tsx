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
      className="relative flex min-h-[calc(100svh-76px)] items-center justify-center border-b border-border-subtle bg-surface px-4 py-16 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
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

        <p className="gsap-hero-item mt-6 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
          Rekrut caregiver terverifikasi, pantau kondisi harian secara real-time,
          dan terima ringkasan perawatan cerdas dalam satu tempat.
        </p>

        <div className="gsap-hero-item mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/login?role=family"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <span>Mulai Pantau</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/register?role=caregiver"
            className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas-subtle"
          >
            Daftar Caregiver
          </Link>
        </div>
      </div>
    </section>
  );
}
