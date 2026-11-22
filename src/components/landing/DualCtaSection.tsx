"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useSectionReveal } from "@/hooks/useGsapReveal";

export function DualCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[80svh] items-center border-b border-[#E5E5E5] bg-[#FFFFFF]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:divide-x md:divide-[#E5E5E5]">
          <div className="gsap-reveal md:pr-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8640B]">
              Untuk Keluarga
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-4xl">
              Kerja lebih tenang, orang tua tetap terjaga.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
              Pantau catatan vital harian, terima ringkasan AI Daily Digest, dan
              temukan caregiver yang sesuai dengan kebutuhan orang tua Anda.
            </p>
            <div className="mt-8">
              <Link
                href="/login?role=family"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C26D10] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#A65B0B] transition-colors"
              >
                <span>Masuk Sebagai Keluarga</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="gsap-reveal md:pl-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A7C59]">
              Untuk Caregiver
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-4xl">
              Temukan keluarga yang tepat dan catat lebih rapi.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
              Temukan lowongan pendampingan lansia terverifikasi, catat laporan
              vital lebih rapi, dan aktifkan respon darurat SOS dalam satu ketukan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/login?role=caregiver"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-6 py-3.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F3E9DD] transition-colors"
              >
                <span>Masuk Sebagai Caregiver</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:119"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#DC4A3D] hover:underline"
              >
                <PhoneCall className="h-4 w-4" />
                <span className="font-mono-vital">Darurat 119</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
