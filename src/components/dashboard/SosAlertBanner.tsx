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
    <section className="mb-6 rounded-2xl border-2 border-danger bg-red-50 p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-danger/20 pb-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-danger" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-danger">
              Peringatan Darurat SOS Aktif
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              {alert.reason}
            </h2>
            <p className="text-xs text-ink-muted">
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
            className="inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Hubungi 119</span>
          </a>
          <button
            type="button"
            onClick={() => onResolve(alert.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas-subtle cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            <span>Tandai Selesai</span>
          </button>
        </div>
      </div>

      {alert.triage_brief && (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-danger/20 bg-surface p-4">
            <p className="text-xs font-bold uppercase text-danger">
              Pasien & Alergi
            </p>
            <p className="mt-1.5 text-sm text-ink">
              {alert.triage_brief.patient_summary}
            </p>
            <p className="mt-2 text-xs font-semibold text-danger">
              Alergi: {alert.triage_brief.allergies.join(", ")}
            </p>
          </div>

          <div className="rounded-xl border border-danger/20 bg-surface p-4">
            <p className="text-xs font-bold uppercase text-ink">
              Obat Rutin & Vital 24 Jam
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-ink">
              {alert.triage_brief.routine_meds.map((med) => (
                <li key={med}>{med}</li>
              ))}
            </ul>
            <p className="font-mono-vital mt-2 text-xs text-ink-muted">
              {alert.triage_brief.last_24h_vitals}
            </p>
          </div>

          <div className="rounded-xl border border-danger/20 bg-surface p-4">
            <p className="text-xs font-bold uppercase text-ink">
              Langkah Segera & RS Terdekat
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-ink">
              {alert.triage_brief.immediate_actions.map((act) => (
                <li key={act}>{act}</li>
              ))}
            </ul>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
              <MapPin className="h-3.5 w-3.5" />
              {elderly.nearest_hospital}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
