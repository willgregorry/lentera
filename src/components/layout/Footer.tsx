import React from "react";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { LenteraMascot } from "@/components/shared/LenteraMascot";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E5E5] bg-[#FFFFFF]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LenteraMascot status="aman" size="sm" />
              <span className="font-display text-lg font-bold text-[#1F2937]">
                Lentera
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
              Menjaga orang tua di rumah, menenangkan hati keluarga di kantor.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-[#1F2937]">
              Navigasi
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link
                  href="/#cara-kerja"
                  className="transition-colors hover:text-[#E8912E]"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=family"
                  className="transition-colors hover:text-[#E8912E]"
                >
                  Masuk Keluarga
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=caregiver"
                  className="transition-colors hover:text-[#E8912E]"
                >
                  Masuk Caregiver
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-[#1F2937]">
              Darurat Medis
            </h4>
            <p className="mt-2.5 text-sm text-[#6B7280]">
              Akses cepat ambulans nasional Kemenkes RI:
            </p>
            <a
              href="tel:119"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#DC4A3D] hover:underline"
            >
              <PhoneCall className="h-4 w-4" />
              <span className="font-mono-vital">119</span> — Ambulans Darurat
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E5E5E5] pt-6 text-xs text-[#6B7280]">
          <p>© 2026 Lentera • IT RUSH 2026.</p>
        </div>
      </div>
    </footer>
  );
}
