"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { LenteraMascot } from "@/components/shared/LenteraMascot";

const ECG_PATH =
  "M0,28 L34,28 L42,28 L47,20 L52,36 L58,10 L65,44 L71,25 L77,28 L120,28 L154,28 L162,28 L167,20 L172,36 L178,10 L185,44 L191,25 L197,28 L240,28";

export function PreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[90svh] items-center border-b border-[#E5E5E5] bg-[#FDFDFD]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
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
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#E8912E] transition-colors hover:text-[#D47E1F]"
            >
              <span>Masuk ke Dashboard Keluarga</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="gsap-reveal lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_24px_54px_-16px_rgba(31,41,55,0.12)]">
              <div className="flex items-center justify-between border-b border-[#EFEFEF] bg-[#FAFAFA] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                </div>
                <span className="text-xs font-medium text-[#6B7280]">
                  lentera.id/dashboard
                </span>
                <span className="w-10" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFEFEF] pb-5">
                  <div>
                    <p className="text-xs font-medium text-[#6B7280]">
                      Profil Lansia
                    </p>
                    <p className="mt-0.5 text-2xl font-bold text-[#1F2937]">
                      Orang Tua (72 th)
                    </p>
                  </div>
                  <LenteraMascot status="aman" size="sm" showLabel />
                </div>

                {/* Clean Light-Mode Apple Health style ECG Strip */}
                <div className="mt-5 overflow-hidden rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] px-4 py-3.5">
                  <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
                    <span>Irama Jantung</span>
                    <span className="font-semibold text-[#4A7C59]">
                      78 bpm · Stabil
                    </span>
                  </div>
                  <div className="relative mt-2 h-14 w-full overflow-hidden">
                    <div className="flex w-[200%] animate-ecg-flow">
                      <svg
                        viewBox="0 0 240 52"
                        className="h-14 w-1/2 shrink-0"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={ECG_PATH}
                          fill="none"
                          stroke="#4A7C59"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 240 52"
                        className="h-14 w-1/2 shrink-0"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={ECG_PATH}
                          fill="none"
                          stroke="#4A7C59"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6 border-b border-[#EFEFEF] pb-6">
                  <div>
                    <p className="text-xs font-medium text-[#6B7280]">
                      Tekanan Darah
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-[#1F2937] sm:text-3xl">
                      124/80
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280]">
                      Detak Nadi
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-[#4A7C59] sm:text-3xl">
                      78 bpm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280]">
                      Kesesuaian
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-[#E8912E] sm:text-3xl">
                      96%
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold text-[#E8912E]">
                    Ringkasan Hari Ini
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563] sm:text-base">
                    Tensi stabil di 124/80 mmHg dan obat pagi sudah diminum.
                    Disarankan sup tahu bayam rendah garam untuk makan malam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
