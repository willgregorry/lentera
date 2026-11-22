import React from "react";
import Link from "next/link";
import { HeartHandshake, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E5E5] bg-[#FFFFFF]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#E8912E]" />
              <span className="font-display text-lg font-bold text-[#1F2937]">
                Lentera
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#6B7280]">
              Menjaga orang tua di rumah, menenangkan hati keluarga di kantor.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-[#1F2937]">
              Navigasi
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link href="/dashboard" className="hover:text-[#E8912E]">
                  Dashboard Keluarga
                </Link>
              </li>
              <li>
                <Link href="/loker" className="hover:text-[#E8912E]">
                  Loker & AI Matcher
                </Link>
              </li>
              <li>
                <Link href="/caregiver" className="hover:text-[#E8912E]">
                  Portal Caregiver & SOS
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#E8912E]">
                  Akun Demo (Budi & Rini)
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

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-[#E5E5E5] pt-6 text-xs text-[#6B7280] sm:flex-row sm:items-center">
          <p>© 2026 Lentera • IT RUSH 2026 Web Development.</p>
          <p>Next.js, Supabase, Google Gemini AI & GSAP.</p>
        </div>
      </div>
    </footer>
  );
}
