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
  LogOut,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasCaregiver, caregiverHasJob } = useAssignmentStatus();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  if (!user) return null;

  const isCaregiver = user.role === "caregiver";

  const linkClass = (active: boolean) =>
    `flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
      active
        ? "bg-primary/15 text-primary"
        : "text-sidebar-muted hover:text-sidebar-ink"
    }`;

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-sidebar-border bg-sidebar/98 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {isCaregiver ? (
          <>
            <Link href="/loker" className={linkClass(pathname === "/loker")}>
              <Briefcase className="h-5 w-5" />
              <span>Lowongan</span>
            </Link>
            {caregiverHasJob && (
              <>
                <Link
                  href="/caregiver"
                  className={linkClass(pathname === "/caregiver")}
                >
                  <ClipboardPlus className="h-5 w-5" />
                  <span>Catat</span>
                </Link>
                <Link
                  href="/caregiver#sos-panel"
                  className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold text-red-300"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>SOS</span>
                </Link>
              </>
            )}
          </>
        ) : hasCaregiver ? (
          <>
            <Link
              href="/dashboard"
              className={linkClass(pathname === "/dashboard")}
            >
              <Activity className="h-5 w-5" />
              <span>Kondisi</span>
            </Link>
            <Link
              href="/notifikasi"
              className={linkClass(pathname === "/notifikasi")}
            >
              <Bell className="h-5 w-5" />
              <span>Laporan</span>
            </Link>
            <Link
              href="/caregivers"
              className={linkClass(pathname === "/caregivers")}
            >
              <UserCheck className="h-5 w-5" />
              <span>Perawat</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/caregivers"
              className={linkClass(pathname === "/caregivers")}
            >
              <Users className="h-5 w-5" />
              <span>Perawat</span>
            </Link>
            <Link href="/loker" className={linkClass(pathname === "/loker")}>
              <Briefcase className="h-5 w-5" />
              <span>Lowongan</span>
            </Link>
          </>
        )}

        <button
          type="button"
          onClick={() => setConfirmLogoutOpen(true)}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold text-sidebar-muted hover:text-red-300 cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>

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
    </nav>
  );
}
