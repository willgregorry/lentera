"use client";

import React, { useState } from "react";
import { AlertTriangle, MapPin, PhoneCall, ShieldAlert } from "lucide-react";
import { CustomSelect, SelectOption } from "@/components/shared/CustomSelect";
import { ElderlyProfile, SosAlert } from "@/types";

const SOS_OPTIONS: SelectOption<string>[] = [
  {
    value: "Tekanan darah melonjak dan orang tua mengeluh pusing berat",
    label: "Tekanan darah melonjak / pusing berat",
  },
  {
    value: "Terjatuh di rumah atau kamar mandi dan mengeluh nyeri",
    label: "Terjatuh di rumah / kamar mandi",
  },
  {
    value: "Sesak napas mendadak atau nyeri dada",
    label: "Sesak napas mendadak / nyeri dada",
  },
  {
    value: "Penurunan kesadaran atau tidak merespons panggilan",
    label: "Penurunan kesadaran mendadak",
  },
];

function formatWaNumber(rawPhone?: string): string {
  const digits = (rawPhone || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return `62${digits}`;
}

interface SosEmergencyPanelProps {
  elderly: ElderlyProfile;
  familyPhone?: string;
  familyName?: string;
  triggering: boolean;
  activeSos: SosAlert | null;
  onTriggerSos: (reason: string) => Promise<void>;
}

export function SosEmergencyPanel({
  elderly,
  familyPhone,
  familyName,
  triggering,
  activeSos,
  onTriggerSos,
}: SosEmergencyPanelProps) {
  const [sosReason, setSosReason] = useState(SOS_OPTIONS[0].value);

  const waNumber = formatWaNumber(familyPhone);
  const waText = encodeURIComponent(
    `DARURAT Lentera: Mohon segera hubungi rumah. Kondisi ${elderly.name}: ${sosReason}.`
  );
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : "";

  return (
    <section className="space-y-5 lg:col-span-5">
      <div className="rounded-2xl border-2 border-danger bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-danger" />
          <div>
            <h2 className="font-display text-base font-bold text-ink sm:text-lg">
              Tombol Darurat SOS
            </h2>
            <p className="text-xs text-ink-muted">
              Picu peringatan real-time ke keluarga & siapkan Kartu Triage
              Medis.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <CustomSelect
            label="Kondisi Darurat"
            value={sosReason}
            options={SOS_OPTIONS}
            onChange={setSosReason}
          />
        </div>

        <button
          type="button"
          onClick={() => onTriggerSos(sosReason)}
          disabled={triggering}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>
            {triggering
              ? "Mengirim Sinyal SOS..."
              : "PICU DARURAT SOS SEKARANG"}
          </span>
        </button>

        <div className="mt-5 space-y-2.5 border-t border-border pt-4">
          <p className="text-xs font-bold text-ink">
            Akses Cepat Medis & Keluarga:
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin className="h-4 w-4 shrink-0 text-danger" />
            <span>{elderly.nearest_hospital}</span>
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:119"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-primary-soft py-2 text-xs font-bold text-danger"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Panggil 119</span>
            </a>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-secondary-soft px-2 py-2 text-center text-xs font-bold text-secondary"
              >
                WA {familyName ? familyName.split(" ")[0] : "Keluarga"}
              </a>
            ) : (
              <span
                title="Nomor WhatsApp keluarga belum diisi"
                className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-border-subtle px-2 py-2 text-center text-xs font-medium text-ink-muted"
              >
                No. WA Belum Ada
              </span>
            )}
          </div>
        </div>
      </div>

      {activeSos?.triage_brief && (
        <div className="rounded-2xl border border-danger/30 bg-primary-soft p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-danger">
            Kartu Triage Darurat AI Siap-Baca
          </p>
          <p className="mt-2 text-xs font-semibold text-ink">
            {activeSos.triage_brief.patient_summary}
          </p>
          {activeSos.triage_brief.allergies.length > 0 && (
            <p className="mt-1.5 text-xs font-bold text-danger">
              Alergi: {activeSos.triage_brief.allergies.join(", ")}
            </p>
          )}
          {activeSos.triage_brief.routine_meds.length > 0 && (
            <p className="mt-1 text-xs text-ink">
              Obat Rutin: {activeSos.triage_brief.routine_meds.join(", ")}
            </p>
          )}
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink">
            {activeSos.triage_brief.immediate_actions.map((act) => (
              <li key={act}>{act}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
