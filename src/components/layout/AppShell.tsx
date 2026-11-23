"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Bell,
  Briefcase,
  ClipboardPlus,
  Lock,
  LogOut,
  PhoneCall,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { supabase } from "@/lib/supabase";
import { notifyUserDevice } from "@/lib/notifications";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface AppShellProps {
  children: React.ReactNode;
}

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
  danger?: boolean;
  alertCount?: number;
}

interface GlobalActiveSos {
  id: string;
  reason: string;
  elderlyName: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Kondisi Orang Tua",
  "/notifikasi": "Laporan Masuk",
  "/caregivers": "Perawat Lansia",
  "/loker": "Lowongan Perawatan",
  "/caregiver": "Catatan Harian",
};

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasCaregiver, caregiverHasJob } = useAssignmentStatus();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [globalSos, setGlobalSos] = useState<GlobalActiveSos | null>(null);
  const isCaregiver = user?.role === "caregiver";

  // Global SOS listener for Family across ALL pages so emergencies are never missed
  useEffect(() => {
    if (!user || user.role !== "family" || !supabase) return;
    const db = supabase;
    let mounted = true;
    let lastNotifiedSosId = "";

    async function checkActiveSos() {
      const { data: elders } = await db
        .from("elderly_profiles")
        .select("id, name")
        .eq("family_id", user!.id);

      if (!mounted || !elders || elders.length === 0) {
        if (mounted) setGlobalSos(null);
        return;
      }

      const elderMap = new Map(
        elders.map((e) => [String(e.id), String(e.name || "Orang Tua")])
      );
      const elderIds = Array.from(elderMap.keys());

      const { data: activeAlert } = await db
        .from("sos_alerts")
        .select("id, elderly_id, location_note")
        .in("elderly_id", elderIds)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (activeAlert) {
        const elderlyName =
          elderMap.get(String(activeAlert.elderly_id)) || "Orang Tua";
        const reason = String(
          activeAlert.location_note || "Kondisi darurat medis di rumah"
        );
        setGlobalSos({
          id: String(activeAlert.id),
          reason,
          elderlyName,
        });

        if (lastNotifiedSosId !== String(activeAlert.id)) {
          lastNotifiedSosId = String(activeAlert.id);
          void notifyUserDevice({
            title: `DARURAT SOS — ${elderlyName}`,
            body: reason,
            url: "/notifikasi",
            urgent: true,
          });
        }
      } else {
        setGlobalSos(null);
      }
    }

    void checkActiveSos();

    const handleRefresh = () => {
      void checkActiveSos();
    };

    window.addEventListener("focus", handleRefresh);
    const intervalId = window.setInterval(handleRefresh, 5000);
    const channel = db
      .channel(`family-global-sos-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sos_alerts" },
        handleRefresh
      )
      .subscribe();

    return () => {
      mounted = false;
      window.removeEventListener("focus", handleRefresh);
      window.clearInterval(intervalId);
      db.removeChannel(channel);
    };
  }, [user]);

  const todayLabel = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const currentTitle = PAGE_TITLES[pathname] || "Lentera";

  const links: SidebarItem[] = isCaregiver
    ? [
        { href: "/loker", label: "Cari Lowongan", icon: Briefcase },
        {
          href: "/caregiver",
          label: "Catat Harian",
          icon: ClipboardPlus,
          locked: !caregiverHasJob,
        },
        ...(caregiverHasJob
          ? [
              {
                href: "/caregiver#sos-panel",
                label: "Darurat SOS",
                icon: AlertTriangle,
                danger: true,
              },
            ]
          : []),
      ]
    : hasCaregiver
    ? [
        { href: "/dashboard", label: "Kondisi Orang Tua", icon: Activity },
        {
          href: "/notifikasi",
          label: "Laporan Masuk",
          icon: Bell,
          alertCount: globalSos ? 1 : 0,
        },
        { href: "/caregivers", label: "Perawat Anda", icon: UserCheck },
        { href: "/loker", label: "Lowongan Saya", icon: Briefcase },
      ]
    : [
        { href: "/caregivers", label: "Cari Perawat", icon: Users },
        { href: "/loker", label: "Lowongan Saya", icon: Briefcase },
        {
          href: "/dashboard",
          label: "Kondisi Orang Tua",
          icon: Activity,
          locked: true,
        },
        {
          href: "/notifikasi",
          label: "Laporan Masuk",
          icon: Bell,
          locked: true,
        },
      ];

  return (
    <div className="min-h-screen bg-app-shell text-ink">
      {/* Truly Fixed Top Bar (never scrolls off viewport) */}
      <header className="fixed top-0 right-0 left-0 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <LenteraMascot status={globalSos ? "darurat" : "aman"} size="sm" />
              <span className="font-display text-base font-bold tracking-[-0.02em] text-ink sm:text-lg">
                Lentera
              </span>
            </Link>
            <span className="hidden text-border sm:inline">/</span>
            <span className="hidden text-xs font-medium text-ink-muted sm:inline">
              {currentTitle}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="hidden text-xs font-medium text-ink-muted md:inline">
              {todayLabel}
            </span>
            {user && (
              <span className="rounded-md bg-canvas-subtle px-2.5 py-1 text-xs font-semibold text-ink">
                {isCaregiver ? "Perawat" : "Keluarga"}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Truly Fixed Floating Navy Sidebar (never scrolls up with page content) */}
      <aside className="fixed top-[72px] bottom-4 left-4 z-20 hidden w-64 flex-col justify-between overflow-y-auto rounded-3xl bg-sidebar p-4 text-sidebar-ink shadow-[0_8px_24px_rgba(19,35,58,0.12)] md:flex xl:left-[max(1rem,calc(50%-684px))]">
        <div>
          <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted">
            {isCaregiver ? "Ruang Perawat" : "Ruang Keluarga"}
          </p>

          <nav className="mt-3 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              if (item.locked) {
                return (
                  <div
                    key={item.href}
                    title={
                      isCaregiver
                        ? "Terbuka setelah lamaran diterima keluarga"
                        : "Terbuka setelah Anda memilih perawat"
                    }
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-muted/45 cursor-not-allowed select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    item.danger
                      ? "font-medium text-red-200 hover:bg-red-500/20"
                      : active
                      ? "bg-primary font-semibold text-white shadow-[0_4px_12px_rgba(232,145,46,0.28)]"
                      : "font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-ink"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.alertCount ? (
                    <span className="rounded-md bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
                      SOS
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {!isCaregiver && !hasCaregiver && (
            <div className="mt-6 rounded-2xl border border-sidebar-border bg-sidebar-surface p-3.5 text-xs leading-relaxed text-sidebar-muted">
              Pilih perawat terlebih dahulu untuk membuka menu{" "}
              <span className="font-semibold text-sidebar-ink">
                Kondisi Orang Tua
              </span>{" "}
              dan{" "}
              <span className="font-semibold text-sidebar-ink">
                Laporan Masuk
              </span>
              .
            </div>
          )}
        </div>

        {user && (
          <div className="mt-6 border-t border-sidebar-border pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-surface text-xs font-bold text-primary ring-1 ring-sidebar-border">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-sidebar-ink">
                  {user.name.split(",")[0]}
                </p>
                <p className="text-xs text-sidebar-muted">
                  {isCaregiver ? "Perawat Lansia" : "Keluarga"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmLogoutOpen(true)}
              className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-ink cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar dari akun</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Stage offset cleanly for fixed header & fixed sidebar */}
      <div className="mx-auto max-w-[1400px] px-3 pt-[72px] pb-4 sm:px-4 md:pl-[288px]">
        {!isCaregiver &&
          globalSos &&
          pathname !== "/dashboard" &&
          pathname !== "/notifikasi" && (
            <div className="mb-4 flex flex-col justify-between gap-3 rounded-2xl border-2 border-danger bg-red-50 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-danger">
                    Darurat SOS Aktif — {globalSos.elderlyName}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">
                    {globalSos.reason}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href="tel:119"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-danger px-3.5 py-2 text-xs font-semibold text-white"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>119</span>
                </a>
                <Link
                  href="/notifikasi"
                  className="inline-flex items-center rounded-xl border border-danger/30 bg-surface px-3.5 py-2 text-xs font-semibold text-danger hover:bg-red-50"
                >
                  Lihat Triage & Tangani
                </Link>
              </div>
            </div>
          )}

        <main className="min-h-[calc(100vh-88px)] min-w-0 rounded-3xl border border-border/70 bg-surface px-4 pt-5 pb-24 shadow-[0_2px_16px_rgba(15,23,42,0.035)] sm:px-8 sm:py-7 md:pb-10">
          {children}
        </main>
      </div>

      <MobileBottomNav />

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Keluar dari Lentera?"
        description="Anda akan keluar dari sesi saat ini dan perlu masuk kembali untuk mengakses data perawatan."
        confirmLabel="Ya, Keluar"
        tone="danger"
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          logout();
        }}
        onCancel={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
}
