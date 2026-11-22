"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VitalChart } from "@/components/shared/VitalChart";
import { NotificationBanner } from "@/components/dashboard/NotificationBanner";
import { SosAlertBanner } from "@/components/dashboard/SosAlertBanner";
import { ElderlyStatusCard } from "@/components/dashboard/ElderlyStatusCard";
import { AiDigestCard } from "@/components/dashboard/AiDigestCard";
import { CareLogTimeline } from "@/components/dashboard/CareLogTimeline";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function FamilyDashboardPage() {
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

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#1F2937]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
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
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 lg:col-span-7">
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold text-[#1F2937]">
                Grafik Tren Vital (3 Hari Terakhir)
              </h2>
              <p className="text-xs text-[#6B7280]">
                Memantau kestabilan tekanan darah dan detak jantung Pak Joko.
              </p>
            </div>
            <VitalChart logs={logs} />
          </div>

          <CareLogTimeline logs={logs} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
