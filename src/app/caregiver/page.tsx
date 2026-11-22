"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Stethoscope } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { CareLogForm } from "@/components/caregiver/CareLogForm";
import { SosEmergencyPanel } from "@/components/caregiver/SosEmergencyPanel";
import { useCaregiverPortal } from "@/hooks/useCaregiverPortal";
import { useAuth } from "@/hooks/useAuth";

export default function CaregiverPortalPage() {
  const router = useRouter();
  const { user: authUser, hydrated } = useAuth();
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

  useEffect(() => {
    if (hydrated && !authUser) {
      router.replace("/login?role=caregiver");
    }
  }, [hydrated, authUser, router]);

  if (!hydrated || !authUser) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F7F8F9] text-[#1F2937]">
        <Navbar />
        <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16">
          <p className="text-sm font-medium text-[#4B5563]">
            Memeriksa sesi masuk...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8F9] text-[#1F2937]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-24 sm:px-6 md:pb-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#355E42] sm:text-sm">
              <Stethoscope className="h-4 w-4" />
              <span>Portal Caregiver — {user?.name || authUser.name}</span>
            </div>
            <h1 className="mt-1 font-display text-xl font-bold text-[#1F2937] sm:text-3xl">
              Catat Perawatan Harian {elderly.name}
            </h1>
            <p className="mt-1 text-xs text-[#4B5563] sm:text-sm">
              Laporkan tanda vital harian atau picu sinyal SOS jika terjadi
              kondisi darurat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#sos-panel"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#DC4A3D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B9382C] lg:hidden"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Akses SOS</span>
            </a>
            <LenteraMascot
              status={activeSos ? "darurat" : "aman"}
              size="sm"
              showLabel
            />
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          <CareLogForm
            submitting={submittingLog}
            successMsg={logSuccess}
            onSubmit={submitCareLog}
          />
          <div id="sos-panel" className="lg:col-span-5">
            <SosEmergencyPanel
              elderly={elderly}
              triggering={triggeringSos}
              activeSos={activeSos}
              onTriggerSos={triggerSos}
            />
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
