"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
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
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-xs lg:col-span-7">
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold text-[#1F2937]">
                Grafik Tren Vital (3 Hari Terakhir)
              </h2>
              <p className="mt-1 text-sm text-[#4B5563]">
                Memantau kestabilan tekanan darah dan detak jantung orang tua.
              </p>
            </div>
            <VitalChart logs={logs} />
          </div>

          <CareLogTimeline logs={logs} />
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
