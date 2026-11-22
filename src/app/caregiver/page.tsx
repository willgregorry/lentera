"use client";

import React from "react";
import { Stethoscope } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { CareLogForm } from "@/components/caregiver/CareLogForm";
import { SosEmergencyPanel } from "@/components/caregiver/SosEmergencyPanel";
import { useCaregiverPortal } from "@/hooks/useCaregiverPortal";

export default function CaregiverPortalPage() {
  const {
    user,
    elderly,
    submittingLog,
    logSuccess,
    triggeringSos,
    activeSos,
    submitCareLog,
    triggerSos,
  } = useCaregiverPortal();

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#1F2937]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A7C59]">
              <Stethoscope className="h-4 w-4" />
              <span>Portal Caregiver — {user?.name || "Rini Wulandari"}</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-[#1F2937] sm:text-3xl">
              Catat Perawatan Harian {elderly.name}
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Laporkan tanda vital harian atau picu sinyal SOS jika terjadi
              kondisi darurat.
            </p>
          </div>

          <LenteraMascot
            status={activeSos ? "darurat" : "aman"}
            size="sm"
            showLabel
          />
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          <CareLogForm
            submitting={submittingLog}
            successMsg={logSuccess}
            onSubmit={submitCareLog}
          />
          <SosEmergencyPanel
            elderly={elderly}
            triggering={triggeringSos}
            activeSos={activeSos}
            onTriggerSos={triggerSos}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
