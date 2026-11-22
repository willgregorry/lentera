"use client";

import React from "react";
import Link from "next/link";
import { Activity, HeartPulse, Pill, Utensils } from "lucide-react";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { CareLog, ElderlyProfile, LenteraStatus } from "@/types";

const MEAL_LABEL: Record<CareLog["meal_portion"], string> = {
  habis: "Habis",
  setengah: "Setengah",
  sedikit: "Sedikit",
  tidak_makan: "Belum Makan",
};

interface ElderlyStatusCardProps {
  elderly: ElderlyProfile;
  status: LenteraStatus;
  latestLog?: CareLog;
}

export function ElderlyStatusCard({
  elderly,
  status,
  latestLog,
}: ElderlyStatusCardProps) {
  return (
    <section className="grid gap-6 border-b border-border pb-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
              Dashboard Pemantauan Keluarga
            </p>
            <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
              {elderly.name}
            </h1>
            <p className="mt-0.5 text-xs text-ink-muted">{elderly.address}</p>
          </div>

          <LenteraMascot status={status} size="sm" showLabel />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted sm:text-xs">
              <Activity className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
              <span>Tekanan Darah</span>
            </div>
            <p className="font-mono-vital mt-1 text-lg font-bold text-ink sm:text-2xl">
              {latestLog
                ? `${latestLog.systolic}/${latestLog.diastolic}`
                : "--/--"}
            </p>
            <p className="text-[11px] text-ink-muted">mmHg</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted sm:text-xs">
              <HeartPulse className="h-3.5 w-3.5 text-danger sm:h-4 sm:w-4" />
              <span>Detak Nadi</span>
            </div>
            <p className="font-mono-vital mt-1 text-lg font-bold text-ink sm:text-2xl">
              {latestLog ? `${latestLog.heart_rate} bpm` : "--"}
            </p>
            <p className="text-[11px] text-ink-muted">Normal: 60–100</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted sm:text-xs">
              <Pill className="h-3.5 w-3.5 text-secondary sm:h-4 sm:w-4" />
              <span>Obat Rutin</span>
            </div>
            <p className="mt-1 text-base font-bold text-secondary sm:text-lg">
              {latestLog?.medication_taken ? "Diminum" : "Belum"}
            </p>
            <p className="text-[11px] text-ink-muted">Jadwal Pagi</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted sm:text-xs">
              <Utensils className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
              <span>Porsi Makan</span>
            </div>
            <p className="mt-1 text-base font-bold text-ink sm:text-lg">
              {latestLog ? MEAL_LABEL[latestLog.meal_portion] : "-"}
            </p>
            <p className="text-[11px] text-ink-muted">Terpantau</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between border-t border-border pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary sm:text-xs">
            Pendamping Bertugas
          </p>
          <p className="mt-1.5 font-display text-base font-bold text-ink sm:text-lg">
            {latestLog?.caregiver_name || "Belum ada caregiver bertugas"}
          </p>
          <p className="text-xs text-ink-muted">
            {latestLog ? "Aktif memantau harian" : "Rekrut caregiver melalui halaman Loker"}
          </p>

          <div className="mt-3.5 border-t border-border pt-3.5 text-xs text-ink-muted space-y-1">
            <p>
              <strong className="text-ink">Alergi:</strong>{" "}
              {elderly.allergies.join(", ")}
            </p>
            <p>
              <strong className="text-ink">RS Terdekat:</strong>{" "}
              {elderly.nearest_hospital}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/caregiver"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-center text-xs font-semibold text-ink hover:bg-[#F3E9DD]"
          >
            Buka Portal Caregiver (Input / SOS)
          </Link>
          <Link
            href="/loker"
            className="rounded-xl bg-primary px-4 py-2 text-center text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Kelola Loker Caregiver
          </Link>
        </div>
      </div>
    </section>
  );
}
