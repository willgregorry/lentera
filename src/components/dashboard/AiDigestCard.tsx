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
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-ink sm:text-lg">
              Ringkasan & Saran Hari Ini
            </h2>
            <p className="text-xs text-ink-muted">
              Disusun otomatis dari catatan harian perawat Anda
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas-subtle disabled:opacity-60 sm:self-auto cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>{loading ? "Memperbarui..." : "Perbarui Ringkasan"}</span>
        </button>
      </div>

      {digest.anomaly_alert && (
        <div className="mt-4 rounded-xl border-l-4 border-warning bg-primary-soft px-4 py-3 text-xs font-semibold text-ink">
          Perlu Perhatian: {digest.anomaly_alert}
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-canvas-subtle p-4">
          <p className="text-xs font-semibold text-primary">Kondisi Umum</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink sm:text-sm">
            {digest.summary}
          </p>
        </div>

        <div className="rounded-xl bg-canvas-subtle p-4">
          <p className="text-xs font-semibold text-secondary">
            Saran Menu Makanan
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink sm:text-sm">
            {digest.meal_suggestion}
          </p>
        </div>

        <div className="rounded-xl bg-canvas-subtle p-4">
          <p className="text-xs font-semibold text-ink">Minum & Aktivitas</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink sm:text-sm">
            {digest.hydration_activity_tip}
          </p>
        </div>
      </div>
    </section>
  );
}
