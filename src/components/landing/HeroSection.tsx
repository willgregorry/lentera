"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHeroReveal } from "@/hooks/useGsapReveal";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-76px)] items-center justify-center border-b border-[#EFEFEF] bg-[#FFFFFF] px-4 py-16 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="gsap-hero-item font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-[#111827] sm:text-6xl">
          Jaga orang tua di rumah,{" "}
          <span className="block text-[#E8912E]">
            tanpa cemas dari kejauhan.
          </span>
        </h1>

        <p className="gsap-hero-item mt-6 max-w-lg text-base leading-relaxed text-[#6B7280] sm:text-lg">
          Rekrut caregiver terverifikasi, pantau kondisi harian secara real-time,
          dan terima ringkasan perawatan cerdas dalam satu tempat.
        </p>

        <div className="gsap-hero-item mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/login?role=family"
            className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#374151]"
          >
            <span>Mulai Pantau</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/register?role=caregiver"
            className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#FFFFFF] px-6 py-3.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F9FAFB]"
          >
            Daftar Caregiver
          </Link>
        </div>
      </div>
    </section>
  );
}
