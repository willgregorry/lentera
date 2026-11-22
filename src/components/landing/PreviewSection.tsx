"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { LenteraMascot } from "@/components/shared/LenteraMascot";

export function PreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[100svh] items-center border-b border-[#E5E5E5] bg-[#FDFDFD]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="gsap-reveal lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A7C59]">
              Pratinjau Dashboard
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-5xl">
              Data vital jelas, tanpa menebak-nebak.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6B7280] sm:text-lg">
              Angka tekanan darah, detak jantung, dan ringkasan harian tersaji
              rapi dalam satu tampilan yang mudah dibaca.
            </p>
            <Link
              href="/login?role=family"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#E8912E] hover:text-[#D47E1F]"
            >
              <span>Masuk ke Dashboard Keluarga</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="gsap-reveal lg:col-span-7">
            <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
                <div>
                  <p className="text-xs text-[#6B7280]">Profil Lansia</p>
                  <p className="font-display text-2xl font-bold text-[#1F2937]">
                    Orang Tua (72 th)
                  </p>
                </div>
                <LenteraMascot status="aman" size="sm" showLabel />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-6 border-b border-[#E5E5E5] pb-6">
                <div>
                  <p className="text-xs text-[#6B7280]">Tekanan Darah</p>
                  <p className="font-mono-vital mt-1 text-3xl font-bold text-[#1F2937]">
                    124/80
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Detak Nadi</p>
                  <p className="font-mono-vital mt-1 text-3xl font-bold text-[#4A7C59]">
                    78 bpm
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">AI Match Caregiver</p>
                  <p className="font-mono-vital mt-1 text-3xl font-bold text-[#E8912E]">
                    96%
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E8912E]">
                  AI Daily Digest
                </p>
                <p className="mt-2 text-base leading-relaxed text-[#1F2937]">
                  Tensi stabil di 124/80 mmHg dan obat pagi sudah diminum.
                  Disarankan sup tahu bayam rendah garam untuk makan malam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
