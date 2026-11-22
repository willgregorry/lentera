"use client";

import React, { useRef } from "react";
import { HeartPulse, Stethoscope, Users } from "lucide-react";
import { useSectionReveal } from "@/hooks/useGsapReveal";

const ACTORS = [
  {
    icon: Users,
    color: "#E8912E",
    role: "01 · Keluarga",
    title: "Tenang saat bekerja",
    desc: "Pantau tren tensi dan ringkasan harian orang tua tanpa harus terus menelepon.",
  },
  {
    icon: Stethoscope,
    color: "#4A7C59",
    role: "02 · Caregiver",
    title: "Catat dalam detik",
    desc: "Isi vital, makan, obat, dan foto aktivitas dengan akses tombol darurat SOS.",
  },
  {
    icon: HeartPulse,
    color: "#DC4A3D",
    role: "03 · Lansia",
    title: "Terjaga di rumah",
    desc: "Mendapat pendampingan yang sesuai riwayat medisnya sepanjang hari.",
  },
];

export function CareLoopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[100svh] items-center border-b border-[#E5E5E5] bg-[#F5F5F5]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="gsap-reveal max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A7C59]">
            Shared Care Loop
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-5xl">
            Satu lingkaran peduli untuk orang tua di rumah.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#E5E5E5] pt-10 md:grid-cols-3">
          {ACTORS.map((actor) => {
            const Icon = actor.icon;
            return (
              <div key={actor.role} className="gsap-reveal">
                <Icon
                  className="h-7 w-7"
                  style={{ color: actor.color }}
                  strokeWidth={1.8}
                />
                <p className="mt-5 font-mono-vital text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  {actor.role}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-[#1F2937]">
                  {actor.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
                  {actor.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
