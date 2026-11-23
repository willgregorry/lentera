"use client";

import React from "react";
import Link from "next/link";
import { Activity, HeartPulse, Pill, UserCheck, Utensils } from "lucide-react";
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
  caregiverName?: string;
}

export function ElderlyStatusCard({
  elderly,
  status,
  latestLog,
  caregiverName,
}: ElderlyStatusCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold text-secondary">
            Kondisi Orang Tua Hari Ini
          </p>
          <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">
            {elderly.name}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            {caregiverName && (
              <Link
                href="/caregivers"
                className="inline-flex items-center gap-1 font-medium text-ink hover:text-primary"
              >
                <UserCheck className="h-3.5 w-3.5 text-secondary" />
                <span>Didampingi {caregiverName}</span>
              </Link>
            )}
            {elderly.address && <span>· {elderly.address}</span>}
          </div>
        </div>

        <LenteraMascot status={status} size="sm" showLabel />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-canvas-subtle p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span>Tekanan Darah</span>
          </div>
          <p className="mt-1.5 text-lg font-bold tabular-nums text-ink sm:text-xl">
            {latestLog
              ? `${latestLog.systolic}/${latestLog.diastolic}`
              : "--/--"}
          </p>
          <p className="text-[11px] text-ink-muted">mmHg</p>
        </div>

        <div className="rounded-xl bg-canvas-subtle p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <HeartPulse className="h-3.5 w-3.5 text-danger" />
            <span>Detak Nadi</span>
          </div>
          <p className="mt-1.5 text-lg font-bold tabular-nums text-ink sm:text-xl">
            {latestLog ? `${latestLog.heart_rate} bpm` : "--"}
          </p>
          <p className="text-[11px] text-ink-muted">Normal 60–100</p>
        </div>

        <div className="rounded-xl bg-canvas-subtle p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Pill className="h-3.5 w-3.5 text-secondary" />
            <span>Obat Rutin</span>
          </div>
          <p className="mt-1.5 text-base font-bold text-secondary sm:text-lg">
            {latestLog
              ? latestLog.medication_taken
                ? "Sudah Diminum"
                : "Belum Diminum"
              : "Menunggu"}
          </p>
          <p className="text-[11px] text-ink-muted">Catatan terbaru</p>
        </div>

        <div className="rounded-xl bg-canvas-subtle p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Utensils className="h-3.5 w-3.5 text-primary" />
            <span>Porsi Makan</span>
          </div>
          <p className="mt-1.5 text-base font-bold text-ink sm:text-lg">
            {latestLog ? MEAL_LABEL[latestLog.meal_portion] : "Menunggu"}
          </p>
          <p className="text-[11px] text-ink-muted">Catatan terbaru</p>
        </div>
      </div>
    </section>
  );
}
