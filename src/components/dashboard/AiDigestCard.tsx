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
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
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
          className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas-subtle disabled:opacity-60 sm:self-auto cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-ink-muted ${loading ? "animate-spin" : ""}`}
          />
          <span>{loading ? "Memperbarui..." : "Perbarui"}</span>
        </button>
      </div>

      {digest.anomaly_alert && (
        <div className="mt-4 rounded-xl border border-warning/30 bg-primary-soft px-4 py-3 text-xs font-medium text-ink">
          <span className="font-bold text-primary">Perlu Perhatian: </span>
          {digest.anomaly_alert}
        </div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-3 md:divide-x md:divide-border-subtle">
        <div className="md:pr-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            Kondisi Umum
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {digest.summary}
          </p>
        </div>

        <div className="md:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
            Rekomendasi Menu
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {digest.meal_suggestion}
          </p>
        </div>

        <div className="md:pl-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
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
