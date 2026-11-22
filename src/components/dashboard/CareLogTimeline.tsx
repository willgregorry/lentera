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
    <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 lg:col-span-5">
      <div className="mb-4 flex items-center justify-between border-b border-[#E5E5E5] pb-3">
        <div>
          <h2 className="font-display text-lg font-bold text-[#1F2937]">
            Catatan Harian Caregiver
          </h2>
          <p className="text-xs text-[#6B7280]">Urutan terbaru di atas</p>
        </div>
        <span className="font-mono-vital text-xs text-[#6B7280]">
          {logs.length} log
        </span>
      </div>

      <div className="max-h-80 divide-y divide-[#E5E5E5] overflow-y-auto pr-1">
        {[...logs].reverse().map((log) => (
          <div key={log.id} className="py-4 first:pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F2937]">
                {log.caregiver_name || "Rini Wulandari"}
              </span>
              <span className="inline-flex items-center gap-1 font-mono-vital text-[#6B7280]">
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
              <span className="font-mono-vital font-semibold text-[#1F2937]">
                {log.systolic}/{log.diastolic} mmHg
              </span>
              <span className="text-[#E5E5E5]">•</span>
              <span className="font-mono-vital font-semibold text-[#E8912E]">
                {log.heart_rate} bpm
              </span>
              <span className="text-[#E5E5E5]">•</span>
              <span className="font-medium text-[#4A7C59]">
                {MEAL_LABEL[log.meal_portion]}
              </span>
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-[#6B7280]">
              {log.notes}
            </p>

            {log.photo_url && (
              <img
                src={log.photo_url}
                alt="Foto aktivitas harian lansia"
                className="mt-2.5 h-32 w-full rounded-xl border border-[#E5E5E5] object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
