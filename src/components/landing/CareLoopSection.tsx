"use client";

import React, { useRef } from "react";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { SplitText } from "@/components/shared/SplitText";

function FamilyIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="#FEF3E7" />
      <path
        d="M8.5 15.2L16 9.5l7.5 5.7v7.8a1.5 1.5 0 0 1-1.5 1.5h-12a1.5 1.5 0 0 1-1.5-1.5v-7.8Z"
        stroke="#E8912E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M16 14.5c1.1 0 2 .9 2 2 0 1.8-2 3.2-2 3.2s-2-1.4-2-3.2c0-1.1.9-2 2-2Z"
        fill="#E8912E"
      />
    </svg>
  );
}

function CaregiverIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="#EDF4EF" />
      <rect
        x="9.5"
        y="8.5"
        width="13"
        height="15.5"
        rx="2.5"
        stroke="#4A7C59"
        strokeWidth="1.8"
      />
      <path
        d="M13 15.5h1.5l1-2 1.2 4 1-2H19"
        stroke="#4A7C59"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ElderlyIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="#FDECEB" />
      <path
        d="M16 22.8s-6.2-3.9-6.2-8.4A3.7 3.7 0 0 1 16 11.7a3.7 3.7 0 0 1 6.2 2.7c0 4.5-6.2 8.4-6.2 8.4Z"
        stroke="#DC4A3D"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="15.5" r="1.5" fill="#DC4A3D" />
    </svg>
  );
}

const ACTORS = [
  {
    Icon: FamilyIcon,
    role: "01 · Keluarga",
    title: "Tenang saat bekerja",
    desc: "Pantau tren tensi dan ringkasan harian orang tua tanpa harus terus menelepon.",
  },
  {
    Icon: CaregiverIcon,
    role: "02 · Caregiver",
    title: "Catat dalam detik",
    desc: "Isi vital, makan, obat, dan foto aktivitas dengan akses tombol darurat SOS.",
  },
  {
    Icon: ElderlyIcon,
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
      id="cara-kerja"
      ref={sectionRef}
      className="flex min-h-[85svh] items-center border-b border-[#E5E5E5] bg-[#FFFFFF]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="gsap-reveal max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A7C59]">
            Cara Kerja
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-5xl">
            <SplitText text="Satu lingkaran peduli untuk orang tua di rumah." />
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#E5E5E5] pt-10 md:grid-cols-3">
          {ACTORS.map((actor) => {
            const CustomIcon = actor.Icon;
            return (
              <div
                key={actor.role}
                className="gsap-reveal group transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="inline-block transition-transform duration-300 group-hover:scale-105">
                  <CustomIcon />
                </div>
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
