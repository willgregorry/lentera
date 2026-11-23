"use client";

import React from "react";
import { Clock } from "lucide-react";
import { CareLog } from "@/types";

const MEAL_LABEL: Record<CareLog["meal_portion"], string> = {
  habis: "Makan Habis",
  setengah: "Setengah Porsi",
  sedikit: "Sedikit",
  tidak_makan: "Belum Makan",
};

interface CareLogTimelineProps {
  logs: CareLog[];
}

export function CareLogTimeline({ logs }: CareLogTimelineProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Catatan Harian Caregiver
          </h2>
          <p className="text-xs text-ink-muted">Urutan terbaru di atas</p>
        </div>
        <span className="font-mono-vital text-xs text-ink-muted">
          {logs.length} log
        </span>
      </div>

      <div className="max-h-80 divide-y divide-border overflow-y-auto pr-1">
        {[...logs].reverse().map((log) => (
          <div key={log.id} className="py-4 first:pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">
                {log.caregiver_name || "Rini Wulandari"}
              </span>
              <span className="inline-flex items-center gap-1 font-mono-vital text-ink-muted">
                <Clock className="h-3 w-3" />
                {new Date(log.logged_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                {new Date(log.logged_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono-vital font-semibold text-ink">
                {log.systolic}/{log.diastolic} mmHg
              </span>
              <span className="text-border">•</span>
              <span className="font-mono-vital font-semibold text-primary">
                {log.heart_rate} bpm
              </span>
              <span className="text-border">•</span>
              <span className="font-medium text-secondary">
                {MEAL_LABEL[log.meal_portion]}
              </span>
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              {log.notes}
            </p>

            {log.photo_url && (
              <img
                src={log.photo_url}
                alt="Foto aktivitas harian lansia"
                className="mt-2.5 h-32 w-full rounded-xl border border-border object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
