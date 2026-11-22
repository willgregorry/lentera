"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, MapPin, PhoneCall } from "lucide-react";
import { ElderlyProfile, SosAlert } from "@/types";

interface SosAlertBannerProps {
  alert: SosAlert;
  elderly: ElderlyProfile;
  onResolve: (id: string) => void;
}

export function SosAlertBanner({
  alert,
  elderly,
  onResolve,
}: SosAlertBannerProps) {
  return (
    <section className="mb-6 rounded-2xl border-2 border-[#DC4A3D] bg-[#FCECEB] p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[#F3C6C2] pb-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-[#DC4A3D]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#A82E23]">
              Peringatan Darurat SOS Aktif
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-[#1F2937]">
              {alert.reason}
            </h2>
            <p className="text-xs text-[#6B7280]">
              Dipicu oleh {alert.triggered_by} •{" "}
              <span className="font-mono-vital">
                {new Date(alert.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="tel:119"
            className="inline-flex items-center gap-2 rounded-xl bg-[#DC4A3D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B9382C]"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Hubungi 119</span>
          </a>
          <button
            type="button"
            onClick={() => onResolve(alert.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#FDFDFD] cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 text-[#4A7C59]" />
            <span>Tandai Selesai</span>
          </button>
        </div>
      </div>

      {alert.triage_brief && (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#F3C6C2] bg-[#FFFFFF] p-4">
            <p className="text-xs font-bold uppercase text-[#A82E23]">
              Pasien & Alergi
            </p>
            <p className="mt-1.5 text-sm text-[#1F2937]">
              {alert.triage_brief.patient_summary}
            </p>
            <p className="mt-2 text-xs font-semibold text-[#A82E23]">
              Alergi: {alert.triage_brief.allergies.join(", ")}
            </p>
          </div>

          <div className="rounded-xl border border-[#F3C6C2] bg-[#FFFFFF] p-4">
            <p className="text-xs font-bold uppercase text-[#1F2937]">
              Obat Rutin & Vital 24 Jam
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-[#1F2937]">
              {alert.triage_brief.routine_meds.map((med) => (
                <li key={med}>{med}</li>
              ))}
            </ul>
            <p className="font-mono-vital mt-2 text-xs text-[#6B7280]">
              {alert.triage_brief.last_24h_vitals}
            </p>
          </div>

          <div className="rounded-xl border border-[#F3C6C2] bg-[#FFFFFF] p-4">
            <p className="text-xs font-bold uppercase text-[#1F2937]">
              Langkah Segera & RS Terdekat
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-[#1F2937]">
              {alert.triage_brief.immediate_actions.map((act) => (
                <li key={act}>{act}</li>
              ))}
            </ul>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#4A7C59]">
              <MapPin className="h-3.5 w-3.5" />
              {elderly.nearest_hospital}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
