"use client";

import React, { useState } from "react";
import { AlertTriangle, MapPin, PhoneCall, ShieldAlert } from "lucide-react";
import { ElderlyProfile, SosAlert } from "@/types";

interface SosEmergencyPanelProps {
  elderly: ElderlyProfile;
  triggering: boolean;
  activeSos: SosAlert | null;
  onTriggerSos: (reason: string) => Promise<void>;
}

export function SosEmergencyPanel({
  elderly,
  triggering,
  activeSos,
  onTriggerSos,
}: SosEmergencyPanelProps) {
  const [sosReason, setSosReason] = useState(
    "Tekanan darah melonjak dan Pak Joko mengeluh pusing berat"
  );

  return (
    <section className="space-y-5 lg:col-span-5">
      <div className="rounded-2xl border-2 border-[#DC4A3D] bg-[#FFFFFF] p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-[#DC4A3D]" />
          <div>
            <h2 className="font-display text-lg font-bold text-[#1F2937]">
              Tombol Darurat SOS
            </h2>
            <p className="text-xs text-[#6B7280]">
              Picu peringatan real-time ke keluarga & siapkan Kartu Triage
              Medis.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-[#1F2937]">
            Kondisi Darurat
          </label>
          <select
            value={sosReason}
            onChange={(e) => setSosReason(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3 py-2.5 text-xs font-medium text-[#1F2937] focus:border-[#DC4A3D] focus:outline-none"
          >
            <option value="Tekanan darah melonjak dan Pak Joko mengeluh pusing berat">
              Tekanan darah melonjak / pusing berat
            </option>
            <option value="Terjatuh di kamar mandi dan mengeluh nyeri pinggul">
              Terjatuh di rumah / kamar mandi
            </option>
            <option value="Sesak napas mendadak atau nyeri dada">
              Sesak napas mendadak / nyeri dada
            </option>
            <option value="Penurunan kesadaran atau tidak merespons panggilan">
              Penurunan kesadaran mendadak
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onTriggerSos(sosReason)}
          disabled={triggering}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC4A3D] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#B9382C] disabled:opacity-60 transition-colors cursor-pointer"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>
            {triggering
              ? "Mengirim Sinyal SOS..."
              : "PICU DARURAT SOS SEKARANG"}
          </span>
        </button>

        <div className="mt-5 space-y-2.5 border-t border-[#E5E5E5] pt-4">
          <p className="text-xs font-bold text-[#1F2937]">
            Akses Cepat Medis Terdekat:
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-[#6B7280]">
            <MapPin className="h-4 w-4 text-[#DC4A3D]" />
            <span>{elderly.nearest_hospital}</span>
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:119"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FCECEB] py-2 text-xs font-bold text-[#A82E23]"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Panggil 119</span>
            </a>
            <a
              href="https://wa.me/6281234567890?text=DARURAT%20Lentera%3A%20Mohon%20segera%20hubungi%20rumah%20Pak%20Joko."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#EDF4EF] py-2 text-xs font-bold text-[#355E42]"
            >
              WA Keluarga
            </a>
          </div>
        </div>
      </div>

      {activeSos?.triage_brief && (
        <div className="rounded-2xl border border-[#F3C6C2] bg-[#FCECEB] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#A82E23]">
            Kartu Triage Darurat AI Siap-Baca
          </p>
          <p className="mt-2 text-xs font-semibold text-[#1F2937]">
            {activeSos.triage_brief.patient_summary}
          </p>
          <p className="mt-1.5 text-xs font-bold text-[#A82E23]">
            Alergi: {activeSos.triage_brief.allergies.join(", ")}
          </p>
          <p className="mt-1 text-xs text-[#1F2937]">
            Obat Rutin: {activeSos.triage_brief.routine_meds.join(", ")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[#1F2937]">
            {activeSos.triage_brief.immediate_actions.map((act) => (
              <li key={act}>{act}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
