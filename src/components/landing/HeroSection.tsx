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
      className="relative flex min-h-[calc(100svh-68px)] items-center justify-center overflow-hidden border-b border-[#E5E5E5] bg-[#FFFFFF] px-4 py-16 sm:px-6"
    >
      {/* Seamless transparent-blended ambient illustration behind hero text */}
      <img
        src="/images/hero_bg.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply select-none"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="gsap-hero-item font-display text-4xl font-bold leading-[1.12] tracking-tight text-[#1F2937] sm:text-6xl">
          Jaga orang tua di rumah,{" "}
          <span className="block text-[#B8640B]">
            tanpa cemas dari kejauhan.
          </span>
        </h1>

        <p className="gsap-hero-item mt-6 max-w-xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
          Rekrut caregiver terverifikasi, pantau kondisi harian secara real-time,
          dan dapatkan ringkasan perawatan AI dalam satu ruang yang tenang.
        </p>

        <div className="gsap-hero-item mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login?role=family"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#1F2937] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#C26D10]"
          >
            <span>Mulai Pantau</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/register?role=caregiver"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4D4D4] bg-[#FFFFFF]/90 px-6 py-3.5 text-sm font-semibold text-[#1F2937] backdrop-blur-sm transition-colors hover:border-[#E8912E] hover:text-[#B8640B]"
          >
            <span>Daftar Caregiver</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
