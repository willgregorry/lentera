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
      className="border-b border-border-subtle bg-surface px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16"
    >
      <div className="relative mx-auto flex min-h-[540px] w-full max-w-6xl items-center overflow-hidden rounded-3xl border border-border bg-canvas-subtle sm:min-h-[600px]">
        <img
          src="/images/hero_care.jpg"
          alt="Pendampingan lansia yang hangat di rumah bersama Lentera"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right select-none"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/10 sm:via-white/82"
        />

        <div className="relative z-10 w-full px-6 py-14 sm:px-12 lg:px-16">
          <div className="max-w-xl text-left">
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.5rem]">
              <SplitText text="Jaga orang tua di rumah," immediate />
              <span className="block text-primary">
                <SplitText
                  text="tanpa cemas dari kejauhan."
                  immediate
                  delay={0.22}
                />
              </span>
            </h1>

            <p className="gsap-hero-item mt-5 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base lg:text-lg">
              Rekrut caregiver terverifikasi, pantau kondisi harian secara
              real-time, dan terima ringkasan perawatan cerdas dalam satu
              tempat.
            </p>

            <div className="gsap-hero-item mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/login?role=family"
                className="btn-diagonal-secondary inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white sm:px-7 sm:py-3.5"
              >
                <span>Mulai Pantau</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/register?role=caregiver"
                className="inline-flex items-center rounded-full border border-border bg-surface/90 px-5 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:bg-canvas-subtle sm:px-6 sm:py-3.5"
              >
                Daftar Caregiver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
