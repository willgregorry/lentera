"use client";

import React from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { AiDigest } from "@/types";

interface AiDigestCardProps {
  digest: AiDigest;
  loading: boolean;
  onRefresh: () => void;
}

export function AiDigestCard({
  digest,
  loading,
  onRefresh,
}: AiDigestCardProps) {
  return (
    <section className="mt-6 border-b border-[#E5E5E5] pb-6">
      <div className="flex flex-col justify-between gap-3 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#B8640B] sm:h-5 sm:w-5" />
          <div>
            <h2 className="font-display text-base font-bold text-[#1F2937] sm:text-lg">
              AI Daily Digest & Saran Perawatan
            </h2>
            <p className="text-[11px] text-[#6B7280] sm:text-xs">
              Dirangkum otomatis dari catatan harian caregiver
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F3E9DD] disabled:opacity-60 sm:self-auto cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>{loading ? "Menganalisis..." : "Perbarui Ringkasan AI"}</span>
        </button>
      </div>

      {digest.anomaly_alert && (
        <div className="mt-2 mb-4 border-l-4 border-[#F59E0B] bg-[#FEF6E8] px-3.5 py-2.5 text-xs font-semibold text-[#9A5B13]">
          Peringatan Dini AI: {digest.anomaly_alert}
        </div>
      )}

      <div className="mt-2 grid gap-4 md:grid-cols-3 md:divide-x md:divide-[#E5E5E5]">
        <div className="md:pr-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B8640B] sm:text-xs">
            Ringkasan Kondisi
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#1F2937] sm:text-sm">
            {digest.summary}
          </p>
        </div>

        <div className="md:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4A7C59] sm:text-xs">
            Saran Menu Makanan
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#1F2937] sm:text-sm">
            {digest.meal_suggestion}
          </p>
        </div>

        <div className="md:pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2937] sm:text-xs">
            Hidrasi & Aktivitas
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#1F2937] sm:text-sm">
            {digest.hydration_activity_tip}
          </p>
        </div>
      </div>
    </section>
  );
}
