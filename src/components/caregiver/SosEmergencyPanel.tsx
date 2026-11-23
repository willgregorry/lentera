"use client";

import React, { useState } from "react";
import { MapPin, PhoneCall } from "lucide-react";
import { CustomSelect, SelectOption } from "@/components/shared/CustomSelect";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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
  const [confirmSosOpen, setConfirmSosOpen] = useState(false);

  const waNumber = formatWaNumber(familyPhone);
  const waText = encodeURIComponent(
    `DARURAT Lentera: Mohon segera hubungi rumah. Kondisi ${elderly.name}: ${sosReason}.`
  );
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : "";

  return (
    <section className="space-y-4 lg:col-span-5">
      <div className="overflow-hidden rounded-2xl border border-border border-t-4 border-t-danger bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-base font-bold tracking-[-0.01em] text-ink sm:text-lg">
            Panggilan Darurat SOS
          </h2>
          <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-danger">
            Siaga 119
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          Kirim peringatan ke keluarga dan siapkan ringkasan riwayat medis untuk
          tim ambulans.
        </p>

        <div className="mt-4">
          <CustomSelect
            label="Pilih Kondisi Darurat"
            value={sosReason}
            options={SOS_OPTIONS}
            onChange={setSosReason}
          />
        </div>

        <button
          type="button"
          onClick={() => setConfirmSosOpen(true)}
          disabled={triggering}
          className="mt-4 flex min-h-[46px] w-full items-center justify-center rounded-xl bg-danger px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {triggering ? "Mengirim Sinyal SOS..." : "Kirim Sinyal Darurat SOS"}
        </button>

        <div className="mt-5 space-y-2.5 border-t border-border-subtle pt-4">
          <p className="text-xs font-semibold text-ink">
            Kontak Medis & Keluarga
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
            <span>{elderly.nearest_hospital}</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href="tel:119"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-danger/25 bg-red-50 py-2 text-xs font-semibold text-danger transition-colors hover:bg-red-100"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Panggil 119</span>
            </a>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-secondary/25 bg-secondary-soft px-2 py-2 text-center text-xs font-semibold text-secondary transition-opacity hover:opacity-90"
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
        <div className="rounded-2xl border border-danger/25 bg-red-50/70 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-danger">
            Ringkasan Triage Medis
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {activeSos.triage_brief.patient_summary}
          </p>
          {activeSos.triage_brief.allergies.length > 0 && (
            <p className="mt-1.5 text-xs font-semibold text-danger">
              Alergi: {activeSos.triage_brief.allergies.join(", ")}
            </p>
          )}
          {activeSos.triage_brief.routine_meds.length > 0 && (
            <p className="mt-1 text-xs text-ink">
              Obat Rutin: {activeSos.triage_brief.routine_meds.join(", ")}
            </p>
          )}
          <ul className="mt-2.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-ink">
            {activeSos.triage_brief.immediate_actions.map((act) => (
              <li key={act}>{act}</li>
            ))}
          </ul>
        </div>
      )}
      <ConfirmDialog
        open={confirmSosOpen}
        title="Kirim Sinyal Darurat SOS?"
        description={`Peringatan darurat untuk ${elderly.name} ("${sosReason}") akan langsung dikirimkan ke keluarga beserta ringkasan medis darurat.`}
        confirmLabel="Ya, Kirim SOS"
        tone="danger"
        loading={triggering}
        onConfirm={async () => {
          await onTriggerSos(sosReason);
          setConfirmSosOpen(false);
        }}
        onCancel={() => setConfirmSosOpen(false)}
      />
    </section>
  );
}
