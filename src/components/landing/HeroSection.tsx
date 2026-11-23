"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useHeroReveal } from "@/hooks/useGsapReveal";
import { SplitText } from "@/components/shared/SplitText";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  useHeroReveal(sectionRef);

  useEffect(() => {
    const el = parallaxRef.current;
    const trigger = sectionRef.current;
    if (!el || !trigger) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, trigger);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-b border-border-subtle bg-surface px-4 pt-5 pb-12 sm:px-6 sm:pt-6 sm:pb-16"
    >
      <div className="relative mx-auto flex min-h-[560px] w-full max-w-7xl items-end overflow-hidden rounded-3xl border border-border bg-canvas-subtle sm:min-h-[640px]">
        <div
          ref={parallaxRef}
          className="pointer-events-none absolute -inset-y-8 inset-x-0 will-change-transform"
        >
          <img
            src="/images/hero_care.jpg"
            alt="Pendampingan lansia yang hangat di rumah bersama Lentera"
            className="animate-ken-burns h-full w-full object-cover object-center select-none"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        />

        <a
          href="#cara-kerja"
          className="absolute top-5 right-6 z-10 hidden items-center gap-1.5 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-black/40 sm:inline-flex"
        >
          <span>Gulir ke bawah</span>
          <ArrowDown className="h-3.5 w-3.5" />
        </a>

        <div className="relative z-10 flex w-full flex-col justify-between gap-6 px-6 pb-8 pt-16 sm:flex-row sm:items-end sm:px-12 sm:pb-12">
          <div className="max-w-2xl text-left">
            <h1 className="font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
              <SplitText text="Jaga orang tua di rumah," immediate />
              <span className="block text-[#FDBA74]">
                <SplitText
                  text="tanpa cemas dari kejauhan."
                  immediate
                  delay={0.22}
                />
              </span>
            </h1>
          </div>

          <div className="gsap-hero-item flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/login?role=family"
              className="btn-diagonal-secondary inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white sm:px-7 sm:py-3.5"
            >
              <span>Mulai Pantau</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/register?role=caregiver"
              className="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25 sm:px-6 sm:py-3.5"
            >
              Daftar Caregiver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
