"use client";

import React from "react";
import Link from "next/link";
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
  const bpHigh = latestLog ? latestLog.systolic >= 140 : false;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-bold tracking-[-0.02em] text-ink sm:text-2xl">
              {elderly.name}
            </h1>
            {elderly.age > 0 && (
              <span className="rounded-md bg-canvas-subtle px-2 py-0.5 text-xs font-medium text-ink-muted">
                {elderly.age} tahun
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-muted">
            {caregiverName && (
              <Link
                href="/caregivers"
                className="font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              >
                Perawat: {caregiverName}
              </Link>
            )}
            {elderly.address && <span>· {elderly.address}</span>}
          </div>
        </div>

        <LenteraMascot status={status} size="sm" showLabel />
      </div>

      {/* Apple Health / Linear style KPI strip */}
      <div className="mt-5 grid grid-cols-2 divide-y divide-border-subtle sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <div className="pb-4 pr-3 sm:pb-0 sm:pr-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-ink-muted">
              Tekanan Darah
            </span>
            {latestLog && (
              <span
                className={`text-[11px] font-semibold ${
                  bpHigh ? "text-warning" : "text-secondary"
                }`}
              >
                {bpHigh ? "Tinggi" : "Stabil"}
              </span>
            )}
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-ink sm:text-3xl">
            {latestLog
              ? `${latestLog.systolic}/${latestLog.diastolic}`
              : "--/--"}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">mmHg</p>
        </div>

        <div className="pb-4 pl-3 sm:px-5 sm:pb-0">
          <span className="text-xs font-medium text-ink-muted">Detak Nadi</span>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-ink sm:text-3xl">
            {latestLog ? latestLog.heart_rate : "--"}
            {latestLog && (
              <span className="ml-1 text-xs font-medium text-ink-muted">
                bpm
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">Rentang 60–100</p>
        </div>

        <div className="pt-4 pr-3 sm:px-5 sm:pt-0">
          <span className="text-xs font-medium text-ink-muted">Obat Rutin</span>
          <p className="mt-2 text-lg font-bold tracking-tight text-ink sm:text-xl">
            {latestLog
              ? latestLog.medication_taken
                ? "Sudah Diminum"
                : "Belum Diminum"
              : "Menunggu"}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Catatan terakhir</p>
        </div>

        <div className="pt-4 pl-3 sm:pl-5 sm:pt-0">
          <span className="text-xs font-medium text-ink-muted">Porsi Makan</span>
          <p className="mt-2 text-lg font-bold tracking-tight text-ink sm:text-xl">
            {latestLog ? MEAL_LABEL[latestLog.meal_portion] : "Menunggu"}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Catatan terakhir</p>
        </div>
      </div>
    </section>
  );
}
