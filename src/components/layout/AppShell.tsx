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
  Lock,
  LogOut,
  UserCheck,
  UserCircle,
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

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasCaregiver, caregiverHasJob } = useAssignmentStatus();
  const isCaregiver = user?.role === "caregiver";

  const links: SidebarItem[] = isCaregiver
    ? [
        {
          href: "/loker",
          label: "Cari Lowongan",
          icon: Briefcase,
        },
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
        {
          href: "/dashboard",
          label: "Kondisi Orang Tua",
          icon: Activity,
        },
        {
          href: "/notifikasi",
          label: "Laporan Masuk",
          icon: Bell,
        },
        {
          href: "/caregivers",
          label: "Perawat Anda",
          icon: UserCheck,
        },
        {
          href: "/loker",
          label: "Lowongan Saya",
          icon: Briefcase,
        },
      ]
    : [
        {
          href: "/caregivers",
          label: "Cari Perawat",
          icon: Users,
        },
        {
          href: "/loker",
          label: "Lowongan Saya",
          icon: Briefcase,
        },
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
    <div className="flex min-h-screen bg-canvas-subtle text-ink">
      {/* Fixed Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-border bg-surface px-4 py-6 md:flex">
        <div>
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <LenteraMascot status="aman" size="sm" />
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Lentera
            </span>
          </Link>

          <p className="mt-7 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            {isCaregiver ? "Menu Perawat" : "Menu Keluarga"}
          </p>

          <nav className="mt-2 space-y-1">
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
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted/60 cursor-not-allowed select-none"
                  >
                    <div className="flex items-center gap-3">
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
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.danger
                      ? "text-danger hover:bg-red-50"
                      : active
                      ? "bg-primary text-white shadow-xs"
                      : "text-ink-muted hover:bg-border-subtle hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {!isCaregiver && !hasCaregiver && (
            <div className="mt-5 rounded-xl border border-border bg-canvas-subtle p-3.5 text-xs leading-relaxed text-ink-muted">
              Pilih atau rekrut perawat terlebih dahulu untuk membuka menu{" "}
              <strong className="text-ink">Kondisi Orang Tua</strong> dan{" "}
              <strong className="text-ink">Laporan Masuk</strong>.
            </div>
          )}
        </div>

        {user && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2.5 px-2">
              <UserCircle className="h-8 w-8 shrink-0 text-secondary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {user.name.split(",")[0]}
                </p>
                <p className="text-xs text-ink-muted">
                  {isCaregiver ? "Perawat Lansia" : "Keluarga"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-red-50 hover:text-danger cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <LenteraMascot status="aman" size="sm" />
            <span className="font-display text-base font-bold text-ink">
              Lentera
            </span>
          </Link>
          {user && (
            <span className="rounded-full bg-border-subtle px-3 py-1 text-xs font-medium text-ink-muted">
              {isCaregiver ? "Perawat" : "Keluarga"}
            </span>
          )}
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24 sm:px-8 sm:py-8 md:pb-10">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
