"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
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
    <section className="rounded-2xl border border-card-blue-border bg-card-blue p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-base font-bold tracking-[-0.01em] text-ink sm:text-lg">
            Ringkasan & Saran Hari Ini
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            Analisis otomatis dari catatan vital dan aktivitas harian perawat
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 sm:self-auto cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>{loading ? "Memperbarui..." : "Perbarui Analisis"}</span>
        </button>
      </div>

      {digest.anomaly_alert && (
        <div className="mt-4 rounded-xl border border-card-cream-border bg-card-cream px-4 py-3 text-xs font-medium text-ink">
          <span className="font-bold text-primary">Perlu Perhatian: </span>
          {digest.anomaly_alert}
        </div>
      )}

      <div className="mt-5 grid gap-3.5 md:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-surface p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-sidebar">
            Kondisi Umum
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {digest.summary}
          </p>
        </div>

        <div className="rounded-xl border border-card-sage-border bg-surface p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-secondary">
            Rekomendasi Menu
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {digest.meal_suggestion}
          </p>
        </div>

        <div className="rounded-xl border border-card-cream-border bg-surface p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">
            Hidrasi & Aktivitas
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {digest.hydration_activity_tip}
          </p>
        </div>
      </div>
    </section>
  );
}
