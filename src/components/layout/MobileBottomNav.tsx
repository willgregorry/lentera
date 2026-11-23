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
  LogOut,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasCaregiver, caregiverHasJob } = useAssignmentStatus();

  if (!user) return null;

  const isCaregiver = user.role === "caregiver";

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-surface/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {isCaregiver ? (
          <>
            <Link
              href="/loker"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/loker" ? "text-primary" : "text-ink-muted"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Lowongan</span>
            </Link>
            {caregiverHasJob && (
              <>
                <Link
                  href="/caregiver"
                  className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                    pathname === "/caregiver"
                      ? "text-primary"
                      : "text-ink-muted"
                  }`}
                >
                  <ClipboardPlus className="h-5 w-5" />
                  <span>Catat</span>
                </Link>
                <Link
                  href="/caregiver#sos-panel"
                  className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold text-danger"
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
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/dashboard" ? "text-primary" : "text-ink-muted"
              }`}
            >
              <Activity className="h-5 w-5" />
              <span>Kondisi</span>
            </Link>
            <Link
              href="/notifikasi"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/notifikasi" ? "text-primary" : "text-ink-muted"
              }`}
            >
              <Bell className="h-5 w-5" />
              <span>Laporan</span>
            </Link>
            <Link
              href="/caregivers"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/caregivers" ? "text-primary" : "text-ink-muted"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              <span>Perawat</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/caregivers"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/caregivers" ? "text-primary" : "text-ink-muted"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Perawat</span>
            </Link>
            <Link
              href="/loker"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/loker" ? "text-primary" : "text-ink-muted"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Lowongan</span>
            </Link>
          </>
        )}

        <button
          type="button"
          onClick={logout}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold text-ink-muted hover:text-danger cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>
    </nav>
  );
}
