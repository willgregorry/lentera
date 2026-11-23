"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, Lock, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { VitalChart } from "@/components/shared/VitalChart";
import { SosAlertBanner } from "@/components/dashboard/SosAlertBanner";
import { ElderlyStatusCard } from "@/components/dashboard/ElderlyStatusCard";
import { AiDigestCard } from "@/components/dashboard/AiDigestCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";

export default function FamilyDashboardPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const {
    loading: checkingStatus,
    hasCaregiver,
    activeCaregiver,
  } = useAssignmentStatus();
  const {
    elderly,
    logs,
    digest,
    activeSos,
    currentStatus,
    latestLog,
    digestLoading,
    refreshDigest,
    resolveSos,
  } = useDashboardData();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?role=family");
      return;
    }
    if (hydrated && user && user.role === "caregiver") {
      router.replace("/caregiver");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== "family") {
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
      {checkingStatus ? (
        <div className="py-16 text-center text-sm text-ink-muted">
          Memuat kondisi orang tua...
        </div>
      ) : !hasCaregiver ? (
        <div className="mt-2 rounded-2xl border border-dashed border-card-blue-border bg-card-blue/45 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-card-cream-border bg-card-cream text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-lg font-bold text-ink sm:text-xl">
            Pemantauan Belum Aktif
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            Anda belum memiliki perawat yang mendampingi orang tua di rumah.
            Pilih perawat atau pasang lowongan terlebih dahulu untuk mulai
            memantau kondisi harian.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/caregivers"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm"
            >
              <Users className="h-4 w-4" />
              <span>Cari Perawat</span>
            </Link>
            <Link
              href="/loker"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary/40 sm:text-sm"
            >
              <Briefcase className="h-4 w-4 text-primary" />
              <span>Pasang Lowongan</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSos && (
            <SosAlertBanner
              alert={activeSos}
              elderly={elderly}
              onResolve={resolveSos}
            />
          )}

          <ElderlyStatusCard
            elderly={elderly}
            status={currentStatus}
            latestLog={latestLog}
            caregiverName={activeCaregiver?.name}
          />

          <AiDigestCard
            digest={digest}
            loading={digestLoading}
            onRefresh={refreshDigest}
          />

          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-bold text-ink sm:text-lg">
                  Grafik Kesehatan 3 Hari Terakhir
                </h2>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Perkembangan tekanan darah dan detak jantung orang tua Anda.
                </p>
              </div>
              <Link
                href="/notifikasi"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <span>Lihat semua laporan masuk ({logs.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <VitalChart logs={logs} />
          </section>
        </div>
      )}
    </AppShell>
  );
}
