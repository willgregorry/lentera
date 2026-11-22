"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { VitalChart } from "@/components/shared/VitalChart";
import { NotificationBanner } from "@/components/dashboard/NotificationBanner";
import { SosAlertBanner } from "@/components/dashboard/SosAlertBanner";
import { ElderlyStatusCard } from "@/components/dashboard/ElderlyStatusCard";
import { AiDigestCard } from "@/components/dashboard/AiDigestCard";
import { CareLogTimeline } from "@/components/dashboard/CareLogTimeline";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";

export default function FamilyDashboardPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const {
    elderly,
    logs,
    digest,
    notifications,
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
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
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
      {notifications.length > 0 && (
        <NotificationBanner notification={notifications[0]} />
      )}

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
      />

      <AiDigestCard
        digest={digest}
        loading={digestLoading}
        onRefresh={refreshDigest}
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-4">
            <h2 className="font-display text-base font-bold text-ink sm:text-lg">
              Grafik Tren Vital (3 Hari Terakhir)
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted sm:text-sm">
              Memantau kestabilan tekanan darah dan detak jantung orang tua.
            </p>
          </div>
          <VitalChart logs={logs} />
        </div>

        <CareLogTimeline logs={logs} />
      </section>
    </AppShell>
  );
}
