"use client";

import React, { useRef } from "react";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { SplitText } from "@/components/shared/SplitText";

const ACTORS = [
  {
    num: "01",
    role: "Keluarga",
    title: "Tenang saat bekerja",
    desc: "Pantau tren tekanan darah, detak jantung, dan ringkasan harian orang tua dari kantor tanpa harus terus menelepon.",
    tag: "Pemantauan & Ringkasan Harian",
  },
  {
    num: "02",
    role: "Caregiver",
    title: "Catat kondisi dalam hitungan detik",
    desc: "Input tanda vital, porsi makan, jadwal obat, dan foto aktivitas secara ringkas dengan akses darurat SOS 119.",
    tag: "Log Cepat & Siaga Darurat",
  },
  {
    num: "03",
    role: "Lansia",
    title: "Terjaga nyaman di rumah sendiri",
    desc: "Mendapat pendampingan yang konsisten dan sesuai dengan riwayat medis, alergi, serta rutinitas harian.",
    tag: "Perawatan Personal",
  },
];

export function CareLoopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      id="cara-kerja"
      ref={sectionRef}
      className="flex min-h-[85svh] items-center border-b border-border-subtle bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="gsap-reveal lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Cara Kerja
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-ink sm:text-5xl">
              <SplitText text="Satu lingkaran peduli untuk orang tua di rumah." />
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted sm:text-base">
              Menghubungkan keluarga yang bekerja, caregiver di rumah, dan
              kebutuhan medis orang tua dalam satu alur yang sederhana.
            </p>
          </div>

          <div className="divide-y divide-border-subtle border-y border-border-subtle lg:col-span-7">
            {ACTORS.map((actor) => (
              <div
                key={actor.num}
                className="gsap-reveal group grid grid-cols-12 gap-4 py-7 transition-colors duration-300 hover:bg-canvas-subtle/80 sm:px-4"
              >
                <div className="col-span-2 sm:col-span-2">
                  <span className="font-display text-2xl font-light tracking-tight text-[#D1D5DB] transition-colors duration-300 group-hover:text-primary sm:text-3xl">
                    {actor.num}
                  </span>
                </div>
                <div className="col-span-10 transition-transform duration-300 group-hover:translate-x-1 sm:col-span-10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      {actor.role}
                    </span>
                    <span className="text-xs font-medium text-ink-muted">
                      {actor.tag}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-ink sm:text-2xl">
                    {actor.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {actor.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
