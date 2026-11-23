"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Bell,
  Briefcase,
  ClipboardPlus,
  Compass,
  Lock,
  LogOut,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
  danger?: boolean;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Kondisi Orang Tua",
  "/notifikasi": "Laporan Masuk",
  "/caregivers": "Cari Perawat",
  "/loker": "Lowongan Saya",
  "/caregiver": "Catat Harian",
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
  const isCaregiver = user?.role === "caregiver";

  const todayLabel = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const currentTitle =
    pathname === "/caregivers" && hasCaregiver
      ? "Perawat Anda"
      : pathname === "/loker" && isCaregiver
      ? "Cari Lowongan"
      : PAGE_TITLES[pathname] || "Lentera";

  const workspaceLabel = isCaregiver ? "Ruang Perawat" : "Ruang Keluarga";

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
        { href: "/notifikasi", label: "Laporan Masuk", icon: Bell },
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
      {/* Top White Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <LenteraMascot status="aman" size="sm" />
              <span className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                Lentera
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-xs font-medium text-ink-muted md:flex">
              <span className="font-semibold text-ink">{workspaceLabel}</span>
              <Link
                href="/#cara-kerja"
                className="transition-colors hover:text-ink"
              >
                Cara Kerja
              </Link>
              <Link href="/#faq" className="transition-colors hover:text-ink">
                Panduan
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {user && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-card-sage-border bg-card-sage px-3 py-1 text-xs font-semibold text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>{isCaregiver ? "Perawat" : "Keluarga"}</span>
              </span>
            )}

            {!isCaregiver && hasCaregiver && (
              <Link
                href="/notifikasi"
                aria-label="Laporan Masuk"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  pathname === "/notifikasi"
                    ? "border-primary bg-card-cream text-primary"
                    : "border-border bg-surface text-ink-muted hover:border-primary/40 hover:text-ink"
                }`}
              >
                <Bell className="h-4 w-4" />
              </Link>
            )}

            {user && (
              <div
                title={user.name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-card-blue-border bg-card-blue text-xs font-bold text-sidebar"
              >
                {getInitials(user.name)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Frame: Floating Deep Navy Sidebar + Crisp White Content Panel */}
      <div className="mx-auto flex max-w-[1440px] gap-4 p-3 sm:p-4">
        <aside className="sticky top-20 hidden h-[calc(100vh-96px)] w-64 shrink-0 flex-col justify-between overflow-y-auto rounded-3xl bg-sidebar p-4 text-sidebar-ink shadow-[0_8px_28px_rgba(19,35,58,0.14)] md:flex">
          <div>
            <div className="px-2.5 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
                {workspaceLabel}
              </p>
              <p className="mt-1 font-display text-sm font-semibold text-sidebar-ink">
                Merawat dengan hati.
              </p>
            </div>

            <nav className="mt-5 space-y-1.5">
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
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-muted/45 cursor-not-allowed select-none"
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
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                      item.danger
                        ? "bg-red-500/15 font-semibold text-red-200 hover:bg-red-500/25"
                        : active
                        ? "bg-primary font-semibold text-white shadow-[0_4px_12px_rgba(232,145,46,0.32)]"
                        : "font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {((!isCaregiver && !hasCaregiver) ||
              (isCaregiver && !caregiverHasJob)) && (
              <div className="mt-6 rounded-2xl border border-sidebar-border bg-sidebar-surface p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Compass className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-semibold text-sidebar-ink">
                  Satu langkah lebih dekat
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-sidebar-muted">
                  {isCaregiver
                    ? "Lamar lowongan keluarga untuk membuka pencatatan vital harian dan SOS."
                    : "Pilih perawat untuk membuka pemantauan kondisi dan laporan harian."}
                </p>
              </div>
            )}
          </div>

          {user && (
            <div className="mt-6 border-t border-sidebar-border pt-4">
              <div className="flex items-center gap-3 px-1.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-surface text-xs font-bold text-primary ring-1 ring-sidebar-border">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-sidebar-ink">
                    {user.name.split(",")[0]}
                  </p>
                  <p className="text-[11px] text-sidebar-muted">
                    {isCaregiver ? "Perawat Lansia" : "Akun Keluarga"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-ink cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar dari akun</span>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content White Stage */}
        <main className="min-w-0 flex-1 rounded-3xl border border-border/70 bg-surface px-4 pt-5 pb-24 shadow-[0_2px_18px_rgba(15,23,42,0.035)] sm:px-7 sm:py-7 md:pb-10">
          {/* Integrated Stage Breadcrumb & Date Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <p className="text-[11px] font-medium text-ink-muted">
                {workspaceLabel} <span className="mx-1.5 text-border">/</span>{" "}
                <span className="text-ink">{currentTitle}</span>
              </p>
              <h2 className="mt-0.5 font-display text-lg font-bold tracking-[-0.02em] text-ink sm:text-xl">
                {currentTitle}
              </h2>
            </div>
            <span className="rounded-full border border-card-blue-border bg-card-blue px-3 py-1 text-[11px] font-medium text-ink-muted">
              {todayLabel}
            </span>
          </div>

          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
