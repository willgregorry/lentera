"use client";

import React, { useRef } from "react";
import { Activity, ShieldAlert, Sparkles } from "lucide-react";
import { useSectionReveal } from "@/hooks/useGsapReveal";

const AI_FEATURES = [
  {
    icon: Sparkles,
    color: "#E8912E",
    tag: "AI Daily Digest",
    title: "Ringkasan & Saran Menu",
    desc: "Merangkum catatan harian caregiver menjadi saran makan dan deteksi dini anomali.",
  },
  {
    icon: Activity,
    color: "#4A7C59",
    tag: "AI Caregiver Matcher",
    title: "Skor Kecocokan Medis",
    desc: "Menilai kesesuaian pengalaman pelamar dengan penyakit kronis lansia secara objektif.",
  },
  {
    icon: ShieldAlert,
    color: "#DC4A3D",
    tag: "AI Emergency Triage",
    title: "Kartu IGD Saat SOS",
    desc: "Mengemas alergi, obat rutin, dan vital 24 jam terakhir untuk tim ambulans 119.",
  },
];

export function AiShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[100svh] items-center border-b border-[#E5E5E5] bg-[#FFFFFF]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="gsap-reveal max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8640B]">
            Didukung Google Gemini AI
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-5xl">
            Tiga kecerdasan buatan untuk keputusan yang lebih cepat.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#E5E5E5] pt-10 md:grid-cols-3">
          {AI_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.tag} className="gsap-reveal">
                <Icon
                  className="h-7 w-7"
                  style={{ color: feat.color }}
                  strokeWidth={1.8}
                />
                <p
                  className="mt-5 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: feat.color }}
                >
                  {feat.tag}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-[#1F2937]">
                  {feat.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
