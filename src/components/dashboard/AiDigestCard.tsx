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
    <section className="mt-6 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
      <div className="flex flex-col justify-between gap-3 border-b border-[#E5E5E5] pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-[#E8912E]" />
          <div>
            <h2 className="font-display text-lg font-bold text-[#1F2937]">
              AI Daily Digest & Saran Perawatan
            </h2>
            <p className="text-xs text-[#6B7280]">
              Dirangkum otomatis dari catatan harian caregiver
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F3E9DD] disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>{loading ? "Menganalisis..." : "Perbarui Ringkasan AI"}</span>
        </button>
      </div>

      {digest.anomaly_alert && (
        <div className="mt-4 border-l-4 border-[#F59E0B] bg-[#FEF6E8] px-4 py-3 text-xs font-semibold text-[#9A5B13]">
          Peringatan Dini AI: {digest.anomaly_alert}
        </div>
      )}

      <div className="mt-5 grid gap-6 md:grid-cols-3 md:divide-x md:divide-[#E5E5E5]">
        <div className="md:pr-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#E8912E]">
            Ringkasan Kondisi
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#1F2937]">
            {digest.summary}
          </p>
        </div>

        <div className="md:px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A7C59]">
            Saran Menu Makanan
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#1F2937]">
            {digest.meal_suggestion}
          </p>
        </div>

        <div className="md:pl-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1F2937]">
            Hidrasi & Aktivitas
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#1F2937]">
            {digest.hydration_activity_tip}
          </p>
        </div>
      </div>
    </section>
  );
}
