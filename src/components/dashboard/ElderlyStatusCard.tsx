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
    <section className="grid gap-6 lg:grid-cols-12">
      <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 lg:col-span-8">
        <div className="flex flex-col justify-between gap-5 border-b border-[#E5E5E5] pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E8912E]">
              Dashboard Pemantauan Keluarga
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-[#1F2937] sm:text-3xl">
              {elderly.name}
            </h1>
            <p className="mt-1 text-xs text-[#6B7280]">{elderly.address}</p>
          </div>

          <LenteraMascot status={status} size="md" showLabel />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Activity className="h-4 w-4 text-[#E8912E]" />
              <span>Tekanan Darah</span>
            </div>
            <p className="font-mono-vital mt-1.5 text-2xl font-bold text-[#1F2937]">
              {latestLog
                ? `${latestLog.systolic}/${latestLog.diastolic}`
                : "--/--"}
            </p>
            <p className="text-[11px] text-[#6B7280]">mmHg</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <HeartPulse className="h-4 w-4 text-[#DC4A3D]" />
              <span>Detak Nadi</span>
            </div>
            <p className="font-mono-vital mt-1.5 text-2xl font-bold text-[#1F2937]">
              {latestLog ? `${latestLog.heart_rate} bpm` : "--"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Normal: 60–100</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Pill className="h-4 w-4 text-[#4A7C59]" />
              <span>Obat Rutin</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-[#4A7C59]">
              {latestLog?.medication_taken ? "Diminum" : "Belum"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Jadwal Pagi</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Utensils className="h-4 w-4 text-[#E8912E]" />
              <span>Porsi Makan</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-[#1F2937]">
              {latestLog ? MEAL_LABEL[latestLog.meal_portion] : "-"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Terpantau</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 lg:col-span-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A7C59]">
            Pendamping Bertugas
          </p>
          <p className="mt-2 font-display text-lg font-bold text-[#1F2937]">
            Rini Wulandari, A.Md.Kep
          </p>
          <p className="text-xs text-[#6B7280]">
            Shift Harian • 07.30 – 16.30 WIB
          </p>

          <div className="mt-4 border-t border-[#E5E5E5] pt-4 text-xs text-[#6B7280] space-y-1">
            <p>
              <strong className="text-[#1F2937]">Alergi:</strong>{" "}
              {elderly.allergies.join(", ")}
            </p>
            <p>
              <strong className="text-[#1F2937]">RS Terdekat:</strong>{" "}
              {elderly.nearest_hospital}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/caregiver"
            className="rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-4 py-2.5 text-center text-xs font-semibold text-[#1F2937] hover:bg-[#F3E9DD]"
          >
            Buka Portal Caregiver (Input / SOS)
          </Link>
          <Link
            href="/loker"
            className="rounded-xl bg-[#E8912E] px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-[#D47E1F]"
          >
            Kelola Loker Caregiver
          </Link>
        </div>
      </div>
    </section>
  );
}
