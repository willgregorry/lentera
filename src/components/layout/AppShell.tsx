"use client";

import React, { useState } from "react";
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
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
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
  const isCaregiver = user?.role === "caregiver";

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
      {/* Minimal Top Bar */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <LenteraMascot status="aman" size="sm" />
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

      {/* Floating Navy Sidebar + Rounded Content Stage */}
      <div className="mx-auto flex max-w-[1400px] gap-4 p-3 sm:p-4">
        <aside className="sticky top-[72px] hidden h-[calc(100vh-88px)] w-64 shrink-0 flex-col justify-between overflow-y-auto rounded-3xl bg-sidebar p-4 text-sidebar-ink shadow-[0_8px_24px_rgba(19,35,58,0.12)] md:flex">
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
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      item.danger
                        ? "font-medium text-red-200 hover:bg-red-500/20"
                        : active
                        ? "bg-primary font-semibold text-white shadow-[0_4px_12px_rgba(232,145,46,0.28)]"
                        : "font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
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

        {/* Main Content Panel */}
        <main className="min-w-0 flex-1 rounded-3xl border border-border/70 bg-surface px-4 pt-5 pb-24 shadow-[0_2px_16px_rgba(15,23,42,0.035)] sm:px-8 sm:py-7 md:pb-10">
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
