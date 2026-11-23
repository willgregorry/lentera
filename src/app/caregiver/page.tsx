"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Briefcase, Lock, Stethoscope } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { CareLogForm } from "@/components/caregiver/CareLogForm";
import { SosEmergencyPanel } from "@/components/caregiver/SosEmergencyPanel";
import { useCaregiverPortal } from "@/hooks/useCaregiverPortal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { apiService, getLocalRegisteredUsers } from "@/services/api";

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

  const [hasActiveJob, setHasActiveJob] = useState(false);
  const [familyPhone, setFamilyPhone] = useState<string>("");
  const [familyName, setFamilyName] = useState<string>("");
  const [checkingJob, setCheckingJob] = useState(true);

  useEffect(() => {
    if (hydrated && !authUser) {
      router.replace("/login?role=caregiver");
      return;
    }
    if (hydrated && authUser && authUser.role === "family") {
      router.replace("/dashboard");
    }
  }, [hydrated, authUser, router]);

  useEffect(() => {
    if (!hydrated || !authUser || authUser.role !== "caregiver") return;
    let active = true;

    async function checkAssignment() {
      setCheckingJob(true);
      try {
        let assigned = false;
        let matchedFamilyId = "";
        let matchedFamilyName = "";

        if (supabase) {
          const [jobsRes, appsRes] = await Promise.all([
            supabase
              .from("care_jobs")
              .select("id, family_id")
              .eq("assigned_caregiver_id", authUser!.id)
              .eq("status", "filled")
              .limit(1),
            supabase
              .from("job_applications")
              .select("id, job_id")
              .eq("caregiver_id", authUser!.id)
              .eq("status", "accepted")
              .limit(1),
          ]);
          if (jobsRes.data && jobsRes.data.length > 0) {
            assigned = true;
            matchedFamilyId = String(jobsRes.data[0].family_id || "");
          } else if (appsRes.data && appsRes.data.length > 0) {
            assigned = true;
          }

          if (matchedFamilyId) {
            const { data: fam } = await supabase
              .from("profiles")
              .select("full_name, phone")
              .eq("id", matchedFamilyId)
              .maybeSingle();
            if (fam && active) {
              setFamilyPhone(fam.phone || "");
              setFamilyName(fam.full_name || "");
            }
          }
        }

        if (!assigned || !matchedFamilyId) {
          const jobs = await apiService.getJobs();
          const matchedJob = jobs.find((job) =>
            (job.applications || []).some(
              (app) =>
                (app.caregiver_id === authUser!.id ||
                  app.caregiver_name === authUser!.name) &&
                app.status === "accepted"
            )
          );
          if (matchedJob) {
            assigned = true;
            matchedFamilyId = matchedJob.family_id;
            matchedFamilyName = matchedJob.family_name;
            const localUsers = getLocalRegisteredUsers();
            const famUser =
              localUsers.find((u) => u.id === matchedJob.family_id) ||
              localUsers.find((u) => u.role === "family");
            if (famUser && active) {
              if (famUser.phone) setFamilyPhone(famUser.phone);
              setFamilyName(famUser.name || matchedFamilyName);
            }
          }
        }

        if (active) setHasActiveJob(assigned);
      } finally {
        if (active) setCheckingJob(false);
      }
    }

    checkAssignment();
    return () => {
      active = false;
    };
  }, [hydrated, authUser]);

  if (!hydrated || !authUser || authUser.role !== "caregiver") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-ink-muted">
            Memeriksa sesi masuk...
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary sm:text-sm">
            <Stethoscope className="h-4 w-4" />
            <span>Portal Caregiver — {user?.name || authUser.name}</span>
          </div>
          <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
            {hasActiveJob
              ? `Catat Perawatan Harian ${elderly.name}`
              : "Portal Caregiver Belum Aktif"}
          </h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            {hasActiveJob
              ? "Laporkan tanda vital harian atau picu sinyal SOS jika terjadi kondisi darurat."
              : "Fitur pencatatan vital & tombol SOS akan terbuka otomatis setelah Anda diterima bekerja oleh keluarga."}
          </p>
        </div>

        {hasActiveJob && (
          <div className="flex items-center gap-3">
            <a
              href="#sos-panel"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover lg:hidden"
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
        )}
      </div>

      {checkingJob ? (
        <div className="py-16 text-center text-sm text-ink-muted">
          Memeriksa status penugasan Anda...
        </div>
      ) : !hasActiveJob ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-border-subtle text-ink-muted">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold text-ink">
            Anda Belum Memiliki Penugasan Aktif
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            Untuk menjaga keamanan data medis lansia, form pencatatan harian dan
            tombol darurat SOS dinonaktifkan sampai lamaran Anda diterima oleh
            keluarga.
          </p>
          <Link
            href="/loker"
            className="btn-diagonal-secondary mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white sm:text-sm"
          >
            <Briefcase className="h-4 w-4" />
            <span>Cari & Lamar Lowongan</span>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <CareLogForm
            submitting={submittingLog}
            successMsg={logSuccess}
            onSubmit={submitCareLog}
          />
          <div id="sos-panel" className="lg:col-span-5">
            <SosEmergencyPanel
              elderly={elderly}
              familyPhone={familyPhone}
              familyName={familyName}
              triggering={triggeringSos}
              activeSos={activeSos}
              onTriggerSos={triggerSos}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
