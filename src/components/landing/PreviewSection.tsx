"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { LenteraMascot } from "@/components/shared/LenteraMascot";

const ECG_PATH =
  "M0,28 L28,28 L38,28 L44,18 L50,38 L58,6 L66,46 L72,24 L78,28 L120,28 L148,28 L154,18 L160,38 L168,6 L176,46 L182,24 L188,28 L240,28";

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
            <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_24px_54px_-16px_rgba(31,41,55,0.14)]">
              {/* macOS Window Top Bar */}
              <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="rounded-md border border-[#E5E5E5] bg-[#FFFFFF] px-3 py-0.5 font-mono-vital text-[11px] text-[#6B7280]">
                  app.lentera.id/dashboard
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#4A7C59]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#4A7C59]" />
                  <span>Live</span>
                </div>
              </div>

              {/* Health Monitor Body */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
                  <div>
                    <p className="text-xs text-[#6B7280]">Profil Lansia</p>
                    <p className="font-display text-2xl font-bold text-[#1F2937]">
                      Orang Tua (72 th)
                    </p>
                  </div>
                  <LenteraMascot status="aman" size="sm" showLabel />
                </div>

                {/* Live Animated ECG Health Monitor Strip */}
                <div className="mt-5 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#141A17] px-4 py-3.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-vital text-[#86B896]">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#4ADE80]" />
                      ECG · SINUS RHYTHM
                    </span>
                    <span>78 BPM · NORMAL</span>
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
                          stroke="#4ADE80"
                          strokeWidth="2.2"
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
                          stroke="#4ADE80"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6 border-b border-[#E5E5E5] pb-6">
                  <div>
                    <p className="text-xs text-[#6B7280]">Tekanan Darah</p>
                    <p className="font-mono-vital mt-1 text-2xl font-bold text-[#1F2937] sm:text-3xl">
                      124/80
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Detak Nadi</p>
                    <p className="font-mono-vital mt-1 text-2xl font-bold text-[#4A7C59] sm:text-3xl">
                      78 bpm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">AI Match Caregiver</p>
                    <p className="font-mono-vital mt-1 text-2xl font-bold text-[#E8912E] sm:text-3xl">
                      96%
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E8912E]">
                    AI Daily Digest
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#1F2937] sm:text-base">
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
